import { Link } from 'react-router-dom'
import type { Provider, Review } from '../state/types'
import { providerOverallRating, isVerifiedProvider } from '../utils/reputation'
import { Stars } from './Stars'
import { VerifiedBadge } from './VerifiedBadge'

export function ProviderCard({
  provider,
  reviews,
  bookingsCountSource,
}: {
  provider: Provider
  reviews: Review[]
  bookingsCountSource?: Parameters<typeof isVerifiedProvider>[2]
}) {
  const overall = providerOverallRating(reviews, provider.id) ?? 0
  const verified = isVerifiedProvider(provider, reviews, bookingsCountSource ?? [])

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-slate-900">{provider.name}</h3>
            {verified ? <VerifiedBadge /> : null}
          </div>
          <div className="mt-1 text-sm text-slate-600">
            {provider.category} · {provider.barangay}, Quezon City
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-2">
            <Stars value={overall} />
            <span className="text-sm font-semibold text-slate-900">
              {overall ? overall.toFixed(1) : 'New'}
            </span>
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Base ₱{provider.baseCalloutFeePhp} · ₱{provider.hourlyRatePhp}/hr
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {provider.skills.slice(0, 4).map((s) => (
          <span
            key={s}
            className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200"
          >
            {s}
          </span>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs text-slate-500">
          {verified
            ? 'Verified badge: ≥4.7 overall, 10+ completed, approved, zero no-show flags'
            : provider.noShowFlags > 0
              ? `No-show flags: ${provider.noShowFlags}`
              : 'Build trust with detailed reviews + evidence'}
        </div>
        <div className="flex gap-2">
          <Link
            to={`/providers/${provider.id}`}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            View profile
          </Link>
          <Link
            to={`/book/${provider.id}`}
            className="rounded-xl bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Book in 3 clicks
          </Link>
        </div>
      </div>
    </div>
  )
}

