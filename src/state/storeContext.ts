import { createContext, useContext } from "react";
import type {
  AppState,
  Booking,
  BookingStatus,
  Message,
  PaymentMethod,
  Review,
  Role,
  ServiceCategory,
  ProviderVerificationStatus,
} from "./types";

export type Store = {
  state: AppState;
  actions: {
    setRole: (role: Role) => void;
    setCustomerName: (name: string) => void;
    markAllNotificationsRead: () => void;
    createBooking: (args: {
      providerId: string;
      category: ServiceCategory;
      issueSummary: string;
      scheduledFor: string;
      estimatedHours: number;
      paymentMethod: PaymentMethod;
    }) => Booking;
    setBookingStatus: (bookingId: string, status: BookingStatus) => void;
    cancelBooking: (
      bookingId: string,
      reason: string,
    ) => { ok: boolean; message?: string };
    rescheduleBooking: (
      bookingId: string,
      newIso: string,
    ) => { ok: boolean; message?: string };
    submitReview: (args: {
      bookingId: string;
      providerId: string;
      ratings: Review["ratings"];
      remarks: string;
      photos: string[];
    }) => Review;
    sendMessage: (args: {
      bookingId: string;
      sender: Message["sender"];
      text: string;
    }) => Message;
    flagReview: (reviewId: string) => void;
    respondToReview: (
      reviewId: string,
      text: string,
    ) => { ok: boolean; message?: string };
    setProviderVerification: (
      providerId: string,
      status: ProviderVerificationStatus,
    ) => void;
  };
};

export const StoreContext = createContext<Store | null>(null);

export function useAppStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useAppStore must be used within AppStoreProvider");
  return ctx;
}
