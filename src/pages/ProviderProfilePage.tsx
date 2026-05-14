import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { EvidenceGallery } from "../components/EvidenceGallery";
import { Stars } from "../components/Stars";
import { VerifiedBadge } from "../components/VerifiedBadge";
import { useAppStore } from "../state/store";
import {
  isVerifiedProvider,
  providerOverallRating,
  providerReviews,
} from "../utils/reputation";

export function ProviderProfilePage() {
  const { providerId } = useParams();
  const { state, actions } = useAppStore();
  const provider = state.providers.find((p) => p.id === providerId);
  if (!provider) {
    return (
      <div className="card text-sm text-slate-700">Provider not found.</div>
    );
  }

  const overall = providerOverallRating(state.reviews, provider.id);
  const verified = isVerifiedProvider(provider, state.reviews, state.bookings);
  const reviews = providerReviews(state.reviews, provider.id).filter(
    (r) => !r.flags.hidden,
  );

  const dimAvg = (key: "punctuality" | "technicalSkill" | "communication") => {
    if (reviews.length === 0) return null;
    const avg =
      reviews.reduce((s, r) => s + r.ratings[key], 0) / reviews.length;
    return Math.round(avg * 10) / 10;
  };

  return (
    <div className="grid gap-6">
      <section className="section">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-semibold text-slate-900">
                {provider.name}
              </h2>
              {verified ? <VerifiedBadge /> : null}
            </div>
            <div className="mt-1 text-slate-600">
              {provider.category} · {provider.barangay}, Quezon City
            </div>
            <p className="mt-4 max-w-2xl text-slate-700">{provider.bio}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              {provider.skills.map((s) => (
                <span key={s} className="chip">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="card w-full max-w-md bg-slate-50">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-900">
                Reputation
              </div>
              <div className="text-xs text-slate-600">
                {reviews.length} reviews
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Stars value={overall ?? 0} />
              <div className="text-lg font-semibold text-slate-900">
                {overall ? overall.toFixed(1) : "New"}
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
              <Metric label="Punctuality" value={dimAvg("punctuality")} />
              <Metric label="Technical" value={dimAvg("technicalSkill")} />
              <Metric label="Comms" value={dimAvg("communication")} />
            </div>
            <div className="mt-4 text-xs text-slate-600">
              Verified badge: overall &gt;4.7 and zero no-show flags.
              <div className="mt-1">
                No-show flags:{" "}
                <span className="font-semibold">{provider.noShowFlags}</span>
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <Link
                to={`/book/${provider.id}`}
                className="btn btn-primary flex-1 px-4 py-2.5 text-sm"
              >
                Book now
              </Link>
              <Link
                to="/marketplace"
                className="btn btn-secondary px-4 py-2.5 text-sm"
              >
                Back
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="section">
          <div className="text-lg font-semibold text-slate-900">
            Community feedback
          </div>
          <div className="mt-4 grid gap-4">
            {reviews.map((r) => (
              <div key={r.id} className="card">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-slate-900">
                    Verified review
                  </div>
                  <div className="text-xs text-slate-500">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-700">
                  <span className="stat-pill">
                    Punctuality: <b>{r.ratings.punctuality.toFixed(1)}</b>
                  </span>
                  <span className="stat-pill">
                    Skill: <b>{r.ratings.technicalSkill.toFixed(1)}</b>
                  </span>
                  <span className="stat-pill">
                    Comms: <b>{r.ratings.communication.toFixed(1)}</b>
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-700">{r.remarks}</p>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    className="btn btn-secondary px-3 py-2 text-sm"
                    onClick={() => actions.flagReview(r.id)}
                  >
                    Flag review
                  </button>
                  {r.providerResponse ? (
                    <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700 ring-1 ring-slate-200">
                      <div className="text-xs font-semibold text-slate-600">
                        Provider response
                      </div>
                      <div className="mt-1">{r.providerResponse.text}</div>
                    </div>
                  ) : state.role === "provider" ? (
                    <ProviderResponseInline
                      onSubmit={(text) => actions.respondToReview(r.id, text)}
                    />
                  ) : null}
                </div>
              </div>
            ))}
            {reviews.length === 0 ? (
              <div className="card bg-slate-50 text-sm text-slate-600">
                No reviews yet — be the first to leave a detailed verified
                review.
              </div>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4">
          <div className="section">
            <div className="text-lg font-semibold text-slate-900">
              Service evidence
            </div>
            <div className="mt-1 text-sm text-slate-600">
              Before &amp; after photos
            </div>
          </div>
          <EvidenceGallery evidence={provider.evidence} />
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200">
      <div className="text-[11px] font-semibold text-slate-600">{label}</div>
      <div className="mt-1 text-sm font-semibold text-slate-900">
        {value ? value.toFixed(1) : "—"}
      </div>
    </div>
  );
}

function ProviderResponseInline({
  onSubmit,
}: {
  onSubmit: (text: string) => { ok: boolean; message?: string };
}) {
  const [text, setText] = useState("");
  return (
    <div className="w-full rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200 sm:max-w-sm">
      <div className="text-xs font-semibold text-slate-600">
        Provider response (max 300)
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        className="textarea mt-2 w-full"
        placeholder="Write one response…"
      />
      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="text-xs text-slate-500">{text.trim().length}/300</div>
        <button
          type="button"
          className="btn btn-dark px-3 py-2 text-xs"
          onClick={() => {
            const res = onSubmit(text);
            if (!res.ok && res.message) alert(res.message);
            if (res.ok) setText("");
          }}
        >
          Post
        </button>
      </div>
    </div>
  );
}
