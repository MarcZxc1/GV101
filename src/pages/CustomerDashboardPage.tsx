import { Link, useSearchParams } from "react-router-dom";
import { useAppStore } from "../state/store";

export function CustomerDashboardPage() {
  const { state, actions } = useAppStore();
  const [params] = useSearchParams();
  const newId = params.get("new");

  const active = state.bookings.filter((b) =>
    ["requested", "accepted", "in_progress"].includes(b.status),
  );
  const history = state.bookings.filter((b) =>
    ["completed", "cancelled"].includes(b.status),
  );

  return (
    <div className="grid gap-6">
      <section className="section">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Customer Portal
            </h2>
            <p className="mt-1 text-slate-600">
              Track active bookings and history. Reviews require 50+ characters
              to stay useful.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => actions.markAllNotificationsRead()}
            >
              Mark notifications read
            </button>
            <Link to="/marketplace" className="btn btn-primary">
              New booking
            </Link>
          </div>
        </div>

        {newId ? (
          <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800 ring-1 ring-emerald-100">
            Booking request sent. You can track it below.
          </div>
        ) : null}
      </section>

      {state.notifications.length > 0 ? (
        <section className="section">
          <div className="text-lg font-semibold text-slate-900">
            Notifications
          </div>
          <div className="mt-4 grid gap-3">
            {state.notifications.slice(0, 6).map((n) => (
              <div
                key={n.id}
                className={`rounded-2xl border p-4 ${
                  n.level === "success"
                    ? "border-emerald-200 bg-emerald-50"
                    : n.level === "warning"
                      ? "border-amber-200 bg-amber-50"
                      : "border-slate-200 bg-slate-50"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      {n.title}
                    </div>
                    <div className="mt-1 text-sm text-slate-700">
                      {n.message}
                    </div>
                  </div>
                  <div className="text-xs text-slate-500">
                    {new Date(n.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <Section title="Active bookings" empty="No active bookings yet.">
        {active.map((b) => (
          <BookingRow key={b.id} bookingId={b.id} />
        ))}
      </Section>

      <Section title="History" empty="No completed bookings yet.">
        {history.map((b) => (
          <BookingRow key={b.id} bookingId={b.id} />
        ))}
      </Section>
    </div>
  );
}

function Section({
  title,
  empty,
  children,
}: {
  title: string;
  empty: string;
  children: React.ReactNode;
}) {
  const has = Array.isArray(children) ? children.length > 0 : true;
  return (
    <section className="section">
      <div className="text-lg font-semibold text-slate-900">{title}</div>
      <div className="mt-4 grid gap-3">
        {has ? (
          children
        ) : (
          <div className="card bg-slate-50 text-sm text-slate-600">{empty}</div>
        )}
      </div>
    </section>
  );
}

function BookingRow({ bookingId }: { bookingId: string }) {
  const { state, actions } = useAppStore();
  const b = state.bookings.find((x) => x.id === bookingId);
  if (!b) return null;
  const provider = state.providers.find((p) => p.id === b.providerId);

  const total =
    b.priceQuotePhp.calloutFee +
    Math.round(b.priceQuotePhp.estimatedHours * b.priceQuotePhp.hourlyRate) +
    b.priceQuotePhp.platformTrustFee;

  const remainingMs =
    b.status === "requested"
      ? Math.max(0, new Date(b.providerResponseDueAt).getTime() - Date.now())
      : 0;
  const remainingMin = Math.ceil(remainingMs / 60000);

  return (
    <div className="card">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-900">
            {provider ? provider.name : "Provider"} · {b.category}
          </div>
          <div className="mt-1 text-sm text-slate-600">{b.issueSummary}</div>
          <div className="mt-2 text-xs text-slate-500">
            Scheduled: {new Date(b.scheduledFor).toLocaleString()} · Status:{" "}
            <span className="font-semibold text-slate-700">{b.status}</span>
          </div>
          {b.status === "requested" ? (
            <div className="mt-2 text-xs text-slate-500">
              Provider response due in:{" "}
              <span className="font-semibold">{remainingMin} min</span>{" "}
              (auto-decline after 30 minutes)
            </div>
          ) : null}
          {b.payment ? (
            <div className="mt-2 text-xs text-slate-500">
              Payment: <span className="font-semibold">{b.payment.status}</span>{" "}
              · Method:{" "}
              <span className="font-semibold">{b.payment.method}</span>
            </div>
          ) : null}
        </div>
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <div className="text-sm font-semibold text-slate-900">₱{total}</div>
          <div className="flex gap-2">
            {provider ? (
              <Link
                to={`/providers/${provider.id}`}
                className="btn btn-secondary px-3 py-2 text-sm"
              >
                Profile
              </Link>
            ) : null}
            <Link
              to={`/messages/${b.id}`}
              className="btn btn-secondary px-3 py-2 text-sm"
            >
              Message
            </Link>
            {["requested", "accepted", "in_progress"].includes(b.status) ? (
              <button
                type="button"
                className="btn btn-secondary px-3 py-2 text-sm"
                onClick={() => {
                  const res = actions.cancelBooking(b.id, "Customer cancelled");
                  if (!res.ok && res.message) alert(res.message);
                }}
              >
                Cancel
              </button>
            ) : null}
            {b.status === "completed" && !b.reviewId ? (
              <Link
                to={`/review/${b.id}`}
                className="btn btn-dark px-3 py-2 text-sm"
              >
                Leave review
              </Link>
            ) : null}
            {b.reviewId ? (
              <span className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-100">
                Reviewed
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
