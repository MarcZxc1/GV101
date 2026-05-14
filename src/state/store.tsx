import { useEffect, useMemo, useReducer, type ReactNode } from "react";
import { initialState } from "../data/mock";
import { StoreContext, type Store } from "./storeContext";
import type {
  AppState,
  AuthSession,
  Booking,
  BookingStatus,
  InAppNotification,
  Message,
  Review,
  ProviderVerificationStatus,
} from "./types";

type Action =
  | { type: "customer.setName"; name: string }
  | { type: "notify.push"; notification: InAppNotification }
  | { type: "notify.readAll" }
  | { type: "auth.hydrate"; session: AuthSession | null }
  | { type: "auth.login"; session: AuthSession }
  | { type: "auth.logout" }
  | { type: "booking.create"; booking: Booking }
  | { type: "booking.setStatus"; bookingId: string; status: BookingStatus }
  | { type: "booking.cancel"; bookingId: string; reason: string; at: string }
  | { type: "booking.reschedule"; bookingId: string; from: string; to: string }
  | { type: "booking.attachReview"; bookingId: string; reviewId: string }
  | { type: "review.add"; review: Review }
  | { type: "review.flag"; reviewId: string }
  | { type: "review.respond"; reviewId: string; text: string; at: string }
  | {
      type: "provider.setVerification";
      providerId: string;
      status: ProviderVerificationStatus;
    }
  | { type: "message.send"; message: Message }
  | { type: "system.tick"; nowIso: string };

const SESSION_STORAGE_KEY = "handilink.session";
const guestProfile = {
  role: initialState.role,
  customerName: initialState.customerName,
};

function applySession(state: AppState, session: AuthSession | null): AppState {
  return {
    ...state,
    auth: { session },
    role: session?.role ?? guestProfile.role,
    customerName: session?.displayName ?? guestProfile.customerName,
  };
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "customer.setName":
      return { ...state, customerName: action.name };
    case "auth.hydrate":
      return applySession(state, action.session);
    case "auth.login":
      return applySession(state, action.session);
    case "auth.logout":
      return applySession(state, null);
    case "notify.push":
      return {
        ...state,
        notifications: [action.notification, ...state.notifications],
      };
    case "notify.readAll":
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      };
    case "booking.create":
      return { ...state, bookings: [action.booking, ...state.bookings] };
    case "booking.setStatus":
      return {
        ...state,
        bookings: state.bookings.map((b) =>
          b.id === action.bookingId
            ? {
                ...b,
                status: action.status,
                payment:
                  action.status === "accepted"
                    ? { ...b.payment, status: "escrow_held" }
                    : action.status === "completed"
                      ? {
                          ...b.payment,
                          status: "released",
                          receiptId: b.payment.receiptId ?? `rcpt_${b.id}`,
                        }
                      : b.payment,
              }
            : b,
        ),
      };
    case "booking.cancel":
      return {
        ...state,
        bookings: state.bookings.map((b) =>
          b.id === action.bookingId
            ? {
                ...b,
                status: "cancelled",
                cancelledAt: action.at,
                cancelReason: action.reason,
              }
            : b,
        ),
      };
    case "booking.reschedule":
      return {
        ...state,
        bookings: state.bookings.map((b) =>
          b.id === action.bookingId
            ? { ...b, scheduledFor: action.to, rescheduledFrom: action.from }
            : b,
        ),
      };
    case "booking.attachReview":
      return {
        ...state,
        bookings: state.bookings.map((b) =>
          b.id === action.bookingId ? { ...b, reviewId: action.reviewId } : b,
        ),
      };
    case "review.add":
      return { ...state, reviews: [action.review, ...state.reviews] };
    case "review.flag": {
      return {
        ...state,
        reviews: state.reviews.map((r) => {
          if (r.id !== action.reviewId) return r;
          const nextCount = r.flags.count + 1;
          return {
            ...r,
            flags: {
              count: nextCount,
              hidden: nextCount >= 3 ? true : r.flags.hidden,
            },
          };
        }),
      };
    }
    case "review.respond": {
      return {
        ...state,
        reviews: state.reviews.map((r) => {
          if (r.id !== action.reviewId) return r;
          if (r.providerResponse) return r;
          return {
            ...r,
            providerResponse: { text: action.text, createdAt: action.at },
          };
        }),
      };
    }
    case "provider.setVerification": {
      return {
        ...state,
        providers: state.providers.map((p) =>
          p.id === action.providerId
            ? { ...p, verificationStatus: action.status }
            : p,
        ),
      };
    }
    case "message.send":
      return { ...state, messages: [...state.messages, action.message] };
    case "system.tick": {
      const now = new Date(action.nowIso).getTime();
      const updated = state.bookings.map((b) => {
        if (b.status !== "requested") return b;
        const due = new Date(b.providerResponseDueAt).getTime();
        if (now <= due) return b;
        return { ...b, status: "declined" as const };
      });
      return { ...state, bookings: updated };
    }
    default:
      return state;
  }
}

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) {
      dispatch({ type: "auth.hydrate", session: null });
      return;
    }
    try {
      const session = JSON.parse(raw) as AuthSession;
      if (!session?.email || !session?.role || !session?.displayName) {
        throw new Error("Invalid session");
      }
      dispatch({ type: "auth.hydrate", session });
    } catch {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
      dispatch({ type: "auth.hydrate", session: null });
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (state.auth.session) {
      window.localStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify(state.auth.session),
      );
    } else {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, [state.auth.session]);

  useEffect(() => {
    const t = setInterval(() => {
      dispatch({ type: "system.tick", nowIso: new Date().toISOString() });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const store = useMemo<Store>(() => {
    return {
      state,
      actions: {
        setCustomerName(name) {
          dispatch({ type: "customer.setName", name });
        },
        markAllNotificationsRead() {
          dispatch({ type: "notify.readAll" });
        },
        login(session) {
          dispatch({ type: "auth.login", session });
        },
        logout() {
          dispatch({ type: "auth.logout" });
        },
        createBooking({
          providerId,
          category,
          issueSummary,
          scheduledFor,
          estimatedHours,
          paymentMethod,
        }) {
          const provider = state.providers.find((p) => p.id === providerId);
          if (!provider) throw new Error("Provider not found");

          const now = new Date();
          const due = new Date(now.getTime() + 30 * 60 * 1000);

          const booking: Booking = {
            id: uid("book"),
            providerId,
            customerName: state.customerName,
            category,
            barangay: "Quezon City",
            issueSummary,
            createdAt: new Date().toISOString(),
            requestedAt: now.toISOString(),
            providerResponseDueAt: due.toISOString(),
            scheduledFor,
            status: "requested",
            priceQuotePhp: {
              calloutFee: provider.baseCalloutFeePhp,
              estimatedHours,
              hourlyRate: provider.hourlyRatePhp,
              platformTrustFee: 49,
            },
            payment: { method: paymentMethod, status: "unpaid" },
          };
          dispatch({ type: "booking.create", booking });
          dispatch({
            type: "notify.push",
            notification: {
              id: uid("ntf"),
              createdAt: new Date().toISOString(),
              level: "info",
              title: "Booking request sent",
              message: `Waiting for provider response (30 min window). Booking ${booking.id.slice(0, 8)}.`,
              read: false,
            },
          });
          return booking;
        },
        setBookingStatus(bookingId, status) {
          dispatch({ type: "booking.setStatus", bookingId, status });
          if (status === "accepted") {
            dispatch({
              type: "notify.push",
              notification: {
                id: uid("ntf"),
                createdAt: new Date().toISOString(),
                level: "success",
                title: "Booking accepted",
                message: `Payment held in escrow (simulated). Booking ${bookingId.slice(0, 8)}.`,
                read: false,
              },
            });
          }
          if (status === "completed") {
            dispatch({
              type: "notify.push",
              notification: {
                id: uid("ntf"),
                createdAt: new Date().toISOString(),
                level: "success",
                title: "Job completed",
                message: `Please submit a verified review within 24 hours (demo).`,
                read: false,
              },
            });
          }
        },
        cancelBooking(bookingId, reason) {
          const b = state.bookings.find((x) => x.id === bookingId);
          if (!b) return { ok: false, message: "Booking not found." };
          const now = new Date();
          const start = new Date(b.scheduledFor);
          const hours = (start.getTime() - now.getTime()) / 36e5;
          if (hours < 2) {
            return {
              ok: false,
              message:
                "Cancellations are blocked within 2 hours of start (SRS rule).",
            };
          }
          dispatch({
            type: "booking.cancel",
            bookingId,
            reason,
            at: now.toISOString(),
          });
          dispatch({
            type: "notify.push",
            notification: {
              id: uid("ntf"),
              createdAt: now.toISOString(),
              level: "warning",
              title: "Booking cancelled",
              message: `Cancelled >2 hours before start (no penalty in demo).`,
              read: false,
            },
          });
          return { ok: true };
        },
        rescheduleBooking(bookingId, newIso) {
          const b = state.bookings.find((x) => x.id === bookingId);
          if (!b) return { ok: false, message: "Booking not found." };
          const now = new Date();
          const start = new Date(b.scheduledFor);
          const hours = (start.getTime() - now.getTime()) / 36e5;
          if (hours < 4) {
            return {
              ok: false,
              message:
                "Rescheduling is blocked within 4 hours of start (SRS rule).",
            };
          }
          dispatch({
            type: "booking.reschedule",
            bookingId,
            from: b.scheduledFor,
            to: newIso,
          });
          dispatch({
            type: "notify.push",
            notification: {
              id: uid("ntf"),
              createdAt: now.toISOString(),
              level: "info",
              title: "Reschedule requested",
              message: `Rescheduled to ${new Date(newIso).toLocaleString()} (demo).`,
              read: false,
            },
          });
          return { ok: true };
        },
        submitReview({ bookingId, providerId, ratings, remarks, photos }) {
          const review: Review = {
            id: uid("rev"),
            bookingId,
            providerId,
            createdAt: new Date().toISOString(),
            ratings,
            remarks,
            photos,
            flags: { count: 0, hidden: false },
          };
          dispatch({ type: "review.add", review });
          dispatch({
            type: "booking.attachReview",
            bookingId,
            reviewId: review.id,
          });
          return review;
        },
        sendMessage({ bookingId, sender, text }) {
          const clean = redactContacts(text.trim());
          const msg: Message = {
            id: uid("msg"),
            bookingId,
            sender,
            createdAt: new Date().toISOString(),
            text: clean,
          };
          dispatch({ type: "message.send", message: msg });
          return msg;
        },
        flagReview(reviewId) {
          dispatch({ type: "review.flag", reviewId });
          dispatch({
            type: "notify.push",
            notification: {
              id: uid("ntf"),
              createdAt: new Date().toISOString(),
              level: "warning",
              title: "Review flagged",
              message: `Review ${reviewId} flagged. Hidden after 3 flags (demo rule).`,
              read: false,
            },
          });
        },
        respondToReview(reviewId, text) {
          const t = text.trim();
          if (t.length === 0)
            return { ok: false, message: "Response is empty." };
          if (t.length > 300)
            return { ok: false, message: "Max 300 characters (SRS)." };
          const now = new Date().toISOString();
          dispatch({ type: "review.respond", reviewId, text: t, at: now });
          return { ok: true };
        },
        setProviderVerification(providerId, status) {
          dispatch({ type: "provider.setVerification", providerId, status });
          dispatch({
            type: "notify.push",
            notification: {
              id: uid("ntf"),
              createdAt: new Date().toISOString(),
              level: "info",
              title: "Provider verification updated",
              message: `Provider ${providerId} is now ${status}.`,
              read: false,
            },
          });
        },
      },
    };
  }, [state]);

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
}

function redactContacts(s: string) {
  // crude, but demonstrates FR-35: redact phone numbers and raw URLs
  const redactedPhone = s.replace(/\b09\d{9}\b/g, "[redacted number]");
  const redactedUrls = redactedPhone.replace(
    /\bhttps?:\/\/\S+\b/gi,
    "[redacted link]",
  );
  return redactedUrls;
}
