import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PriceBreakdown } from "../components/PriceBreakdown";
import { useAppStore } from "../state/storeContext";
import type { PaymentMethod } from "../state/types";

export function BookingCheckoutPage() {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const { state, actions } = useAppStore();
  const provider = state.providers.find((p) => p.id === providerId);

  const [issueSummary, setIssueSummary] = useState(
    "Leaking faucet / minor repair",
  );
  const [estimatedHours, setEstimatedHours] = useState(1.5);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("GCash");
  const [scheduledFor, setScheduledFor] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(10, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  });

  const quote = useMemo(() => {
    if (!provider) return null;
    return {
      calloutFee: provider.baseCalloutFeePhp,
      estimatedHours,
      hourlyRate: provider.hourlyRatePhp,
      platformTrustFee: 49,
    };
  }, [estimatedHours, provider]);

  if (!provider || !quote) {
    return (
      <div className="card text-sm text-slate-700">Provider not found.</div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-5">
      <section className="md:col-span-3">
        <div className="section">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Booking / Checkout
              </h2>
              <div className="mt-1 text-slate-600">
                {provider.name} · {provider.category} · Quezon City
              </div>
            </div>
            <Link
              to={`/providers/${provider.id}`}
              className="btn btn-secondary px-3 py-2 text-sm"
            >
              Profile
            </Link>
          </div>

          <div className="mt-6 grid gap-4">
            <div className="card bg-brand-50 p-4 ring-1 ring-brand-100">
              <div className="text-sm font-semibold text-brand-900">
                Three-click booking
              </div>
              <div className="mt-1 text-sm text-brand-800">
                1) Confirm details · 2) Review pricing · 3) Book request sent
              </div>
            </div>

            <label className="grid gap-1">
              <span className="text-xs font-semibold text-slate-700">
                Issue summary
              </span>
              <input
                value={issueSummary}
                onChange={(e) => setIssueSummary(e.target.value)}
                className="input"
                aria-invalid={issueSummary.trim().length < 20}
                aria-describedby="issue-summary-help"
              />
              <div
                id="issue-summary-help"
                className="flex items-center justify-between text-xs"
              >
                <span
                  className={
                    issueSummary.trim().length < 20
                      ? "text-rose-600"
                      : "text-slate-500"
                  }
                >
                  {issueSummary.trim().length < 20
                    ? `Minimum 20 characters required (SRS).`
                    : "Looks good."}
                </span>
                <span className="text-slate-500">
                  {issueSummary.trim().length}/20
                </span>
              </div>
            </label>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="grid gap-1">
                <span className="text-xs font-semibold text-slate-700">
                  Schedule (QC time)
                </span>
                <input
                  type="datetime-local"
                  value={scheduledFor}
                  onChange={(e) => setScheduledFor(e.target.value)}
                  className="input"
                />
              </label>

              <label className="grid gap-1">
                <span className="text-xs font-semibold text-slate-700">
                  Estimated hours ({estimatedHours.toFixed(1)})
                </span>
                <input
                  type="range"
                  min={0.5}
                  max={4}
                  step={0.5}
                  value={estimatedHours}
                  onChange={(e) => setEstimatedHours(Number(e.target.value))}
                  className="w-full"
                />
              </label>
            </div>

            <label className="grid gap-1">
              <span className="text-xs font-semibold text-slate-700">
                Payment method (simulated)
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(["GCash", "PayMaya", "Card"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={`btn px-3 py-2 text-sm ring-1 ${
                      paymentMethod === m
                        ? "bg-brand-50 text-brand-800 ring-brand-100"
                        : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50"
                    }`}
                    onClick={() => setPaymentMethod(m)}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </label>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-slate-500">
                Location lock: Quezon City, Philippines · In-memory simulation
              </div>
              <button
                type="button"
                disabled={issueSummary.trim().length < 20}
                className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => {
                  const booking = actions.createBooking({
                    providerId: provider.id,
                    category: provider.category,
                    issueSummary: issueSummary.trim() || "Minor repair",
                    scheduledFor: new Date(scheduledFor).toISOString(),
                    estimatedHours,
                    paymentMethod,
                  });
                  navigate(`/customer?new=${encodeURIComponent(booking.id)}`);
                }}
              >
                Confirm &amp; send request
              </button>
            </div>
          </div>
        </div>
      </section>

      <aside className="md:col-span-2">
        <PriceBreakdown {...quote} />
      </aside>
    </div>
  );
}
