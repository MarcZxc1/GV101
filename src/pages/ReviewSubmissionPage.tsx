import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Stars } from "../components/Stars";
import { useAppStore } from "../state/store";
import { clampRating, overallFromDimensions } from "../utils/reputation";

export function ReviewSubmissionPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { state, actions } = useAppStore();
  const booking = state.bookings.find((b) => b.id === bookingId);

  const provider = booking
    ? state.providers.find((p) => p.id === booking.providerId)
    : undefined;

  const [punctuality, setPunctuality] = useState(5);
  const [technicalSkill, setTechnicalSkill] = useState(5);
  const [communication, setCommunication] = useState(5);
  const [remarks, setRemarks] = useState(
    "Clear communication, arrived on time, and the repair held up well after testing.",
  );
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const overall = useMemo(
    () =>
      overallFromDimensions({
        punctuality,
        technicalSkill,
        communication,
      }),
    [communication, punctuality, technicalSkill],
  );

  if (!booking || !provider) {
    return (
      <div className="card text-sm text-slate-700">Booking not found.</div>
    );
  }

  const tooShort = remarks.trim().length < 50;

  return (
    <div className="grid gap-6 md:grid-cols-5">
      <section className="md:col-span-3">
        <div className="section">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Submit a verified review
              </h2>
              <div className="mt-1 text-slate-600">
                {provider.name} · Booking {booking.id.slice(0, 8)}
              </div>
            </div>
            <Link
              to="/customer"
              className="btn btn-secondary px-3 py-2 text-sm"
            >
              Back
            </Link>
          </div>

          <div className="mt-6 grid gap-4">
            <RatingControl
              label="Punctuality"
              value={punctuality}
              onChange={(v) => setPunctuality(v)}
            />
            <RatingControl
              label="Technical Skill"
              value={technicalSkill}
              onChange={(v) => setTechnicalSkill(v)}
            />
            <RatingControl
              label="Communication"
              value={communication}
              onChange={(v) => setCommunication(v)}
            />

            <label className="grid gap-1">
              <span className="text-xs font-semibold text-slate-700">
                Remarks (min 50 characters)
              </span>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={5}
                className={`textarea ${
                  tooShort ? "border-rose-300" : "border-slate-200"
                }`}
                aria-invalid={tooShort}
                aria-describedby="review-remarks-help"
              />
              <div
                id="review-remarks-help"
                className="flex items-center justify-between text-xs"
              >
                <span className={tooShort ? "text-rose-600" : "text-slate-500"}>
                  {tooShort
                    ? `Add ${50 - remarks.trim().length} more characters for depth.`
                    : "Looks good — thanks for being specific."}
                </span>
                <span className="text-slate-500">
                  {remarks.trim().length}/50
                </span>
              </div>
            </label>

            <label className="grid gap-1">
              <span className="text-xs font-semibold text-slate-700">
                Photo upload (optional)
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png"
                multiple
                onChange={(e) => {
                  setPhotoError(null);
                  const files = Array.from(e.target.files ?? []);
                  const maxCount = 5;
                  const maxBytes = 5 * 1024 * 1024;

                  const accepted = files.filter((f) => {
                    const okType =
                      f.type === "image/jpeg" || f.type === "image/png";
                    const okSize = f.size <= maxBytes;
                    return okType && okSize;
                  });

                  const rejectedCount = files.length - accepted.length;
                  if (rejectedCount > 0) {
                    setPhotoError(
                      "Some files were rejected (only JPEG/PNG ≤ 5MB).",
                    );
                  }

                  setPhotoUrls((prev) => {
                    const remaining = Math.max(0, maxCount - prev.length);
                    const urls = accepted
                      .slice(0, remaining)
                      .map((f) => URL.createObjectURL(f));
                    if (accepted.length > remaining) {
                      setPhotoError(
                        `You can only attach up to ${maxCount} photos.`,
                      );
                    }
                    return [...prev, ...urls];
                  });
                }}
                className="block w-full rounded-xl border border-slate-200 bg-white p-3 text-sm"
              />
              <div className="text-xs text-slate-500">
                Up to 5 photos · JPEG/PNG only · max 5MB each (SRS).
              </div>
              {photoError ? (
                <div className="text-xs text-rose-600" role="alert">
                  {photoError}
                </div>
              ) : null}
              {photoUrls.length > 0 ? (
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {photoUrls.slice(0, 6).map((u) => (
                    <img
                      key={u}
                      src={u}
                      alt="Upload preview"
                      loading="lazy"
                      decoding="async"
                      className="h-24 w-full rounded-xl object-cover ring-1 ring-slate-200"
                    />
                  ))}
                </div>
              ) : null}
            </label>

            <button
              type="button"
              disabled={tooShort || booking.reviewId !== undefined}
              className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => {
                const review = actions.submitReview({
                  bookingId: booking.id,
                  providerId: provider.id,
                  ratings: {
                    punctuality: clampRating(punctuality),
                    technicalSkill: clampRating(technicalSkill),
                    communication: clampRating(communication),
                  },
                  remarks: remarks.trim(),
                  photos: photoUrls,
                });
                actions.setBookingStatus(booking.id, "completed");
                navigate(`/providers/${review.providerId}`);
              }}
            >
              Submit review
            </button>
          </div>
        </div>
      </section>

      <aside className="md:col-span-2">
        <div className="section">
          <div className="text-sm font-semibold text-slate-900">
            Your overall score
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Stars value={overall} />
            <div className="text-lg font-semibold text-slate-900">
              {overall.toFixed(1)}
            </div>
          </div>
          <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-xs text-slate-600 ring-1 ring-slate-200">
            Reviews are “verified” by flow: they’re only submitted from a
            completed booking in this demo.
          </div>
        </div>
      </aside>
    </div>
  );
}

function RatingControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="card">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-slate-900">{label}</div>
        <div className="text-sm font-semibold text-slate-900">
          {value.toFixed(1)}
        </div>
      </div>
      <input
        type="range"
        min={1}
        max={5}
        step={0.1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 w-full"
      />
    </div>
  );
}
