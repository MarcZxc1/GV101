import { Link } from "react-router-dom";
import { useNow } from "../hooks/useNow";
import { useAppStore } from "../state/storeContext";

export function ProviderDashboardPage() {
  const { state, actions } = useAppStore();
  const now = useNow(1000);

  const requests = state.bookings.filter((b) => b.status === "requested");
  const active = state.bookings.filter((b) =>
    ["accepted", "in_progress"].includes(b.status),
  );
  const completed = state.bookings.filter((b) => b.status === "completed");
  const pendingReview = state.bookings.filter(
    (b) => b.status === "pending_review",
  );

  return (
    <div className="grid gap-6">
      <section className="section">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Provider Portal
            </h2>
            <p className="mt-1 text-slate-600">
              Manage job requests and build reputation with verified ratings and
              evidence.
            </p>
          </div>
          <Link to="/marketplace" className="btn btn-secondary">
            View marketplace
          </Link>
        </div>
      </section>

      <PortalSection title="Job requests" empty="No incoming requests yet.">
        {requests.map((b) => {
          const provider = state.providers.find((p) => p.id === b.providerId);
          const remainingMs =
            now > 0
              ? Math.max(0, new Date(b.providerResponseDueAt).getTime() - now)
              : 0;
          const remainingMin = Math.ceil(remainingMs / 60000);
          return (
            <div key={b.id} className="card">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    {provider ? provider.name : "Provider"} · {b.category}
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    {b.issueSummary}
                  </div>
                  <div className="mt-2 text-xs text-slate-500">
                    Customer: {b.customerName} · Scheduled:{" "}
                    {new Date(b.scheduledFor).toLocaleString()}
                  </div>
                  <div className="mt-2 text-xs text-slate-500">
                    Accept/decline within{" "}
                    <span className="font-semibold">{remainingMin} min</span>{" "}
                    (auto-decline after 30 minutes)
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="btn btn-dark px-3 py-2 text-sm"
                    onClick={() => actions.setBookingStatus(b.id, "accepted")}
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary px-3 py-2 text-sm"
                    onClick={() => actions.setBookingStatus(b.id, "declined")}
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </PortalSection>

      <PortalSection title="Active jobs" empty="No active jobs.">
        {active.map((b) => (
          <div key={b.id} className="card">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  Booking {b.id.slice(0, 8)} · {b.category}
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  {b.issueSummary}
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  Status:{" "}
                  <span className="font-semibold text-slate-700">
                    {b.status}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {b.status === "accepted" ? (
                  <button
                    type="button"
                    className="btn btn-secondary px-3 py-2 text-sm"
                    onClick={() =>
                      actions.setBookingStatus(b.id, "in_progress")
                    }
                  >
                    Start
                  </button>
                ) : null}
                <button
                  type="button"
                  className="btn btn-primary px-3 py-2 text-sm"
                  onClick={() =>
                    actions.setBookingStatus(b.id, "pending_review")
                  }
                >
                  Mark complete (pending review)
                </button>
              </div>
            </div>
            <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 ring-1 ring-slate-200">
              After completion, the customer can submit a verified review
              (remarks 50+ chars).
            </div>
          </div>
        ))}
      </PortalSection>

      <PortalSection title="Completed jobs" empty="No completed jobs yet.">
        {pendingReview.map((b) => (
          <div key={b.id} className="card">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  Pending review · {b.category}
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  {b.issueSummary}
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  Customer has 24h to review (simulated). Payment is held in
                  escrow until review or completion.
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="btn btn-primary px-3 py-2 text-sm"
                  onClick={() => actions.setBookingStatus(b.id, "completed")}
                >
                  Release payout
                </button>
              </div>
            </div>
          </div>
        ))}
        {completed.map((b) => (
          <div key={b.id} className="card">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  {b.category} · {new Date(b.scheduledFor).toLocaleDateString()}
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  {b.issueSummary}
                </div>
              </div>
              <div className="text-xs text-slate-500">
                Review status:{" "}
                <span className="font-semibold text-slate-700">
                  {b.reviewId ? "submitted" : "pending"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </PortalSection>
    </div>
  );
}

function PortalSection({
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
