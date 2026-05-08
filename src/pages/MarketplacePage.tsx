import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ProviderCard } from '../components/ProviderCard'
import { useAppStore } from '../state/store'
import type { ServiceCategory } from '../state/types'
import { haversineKm } from '../utils/geo'
import { providerOverallRating } from '../utils/reputation'

const categories: Array<ServiceCategory | 'All'> = [
  'All',
  'Plumbing',
  'Electrical',
  'General Maintenance',
]

type SortMode = 'Best match' | 'Rating' | 'Price (low)' | 'Price (high)' | 'Distance'

export function MarketplacePage() {
  const { state } = useAppStore()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<(typeof categories)[number]>('All')
  const [minRating, setMinRating] = useState(0)
  const [radiusKm, setRadiusKm] = useState(5)
  const [maxHourlyRate, setMaxHourlyRate] = useState(1000)
  const [availabilityOnly, setAvailabilityOnly] = useState(false)
  const [sortMode, setSortMode] = useState<SortMode>('Best match')
  const [view, setView] = useState<'list' | 'map'>('list')

  const items = useMemo(() => {
    const q = query.trim().toLowerCase()
    const now = new Date()
    const today = now.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6

    const base = state.providers
      .filter((p) => (category === 'All' ? true : p.category === category))
      .filter((p) => p.verificationStatus === 'approved' || true)
      .filter((p) =>
        q
          ? `${p.name} ${p.category} ${p.skills.join(' ')} ${p.barangay}`
              .toLowerCase()
              .includes(q)
          : true,
      )
      .map((p) => {
        const dist = haversineKm(state.customerLocation, p.location)
        const overall = providerOverallRating(state.reviews, p.id) ?? 0
        const isAvailableToday = p.availability.some((w) => w.day === today)
        return { provider: p, dist, overall, isAvailableToday }
      })
      .filter((x) => x.dist <= radiusKm)
      .filter((x) => x.provider.hourlyRatePhp <= maxHourlyRate)
      .filter((x) => (availabilityOnly ? x.isAvailableToday : true))
      .filter((x) => (minRating > 0 ? x.overall >= minRating : true))

    const sorted = [...base].sort((a, b) => {
      if (sortMode === 'Rating') return b.overall - a.overall
      if (sortMode === 'Price (low)') return a.provider.hourlyRatePhp - b.provider.hourlyRatePhp
      if (sortMode === 'Price (high)') return b.provider.hourlyRatePhp - a.provider.hourlyRatePhp
      if (sortMode === 'Distance') return a.dist - b.dist
      // Best match: rating + proximity heuristic
      const scoreA = a.overall * 10 - a.dist
      const scoreB = b.overall * 10 - b.dist
      return scoreB - scoreA
    })

    return sorted
  }, [
    availabilityOnly,
    category,
    maxHourlyRate,
    minRating,
    query,
    radiusKm,
    sortMode,
    state.customerLocation,
    state.providers,
    state.reviews,
  ])

  return (
    <div className="grid gap-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Service Marketplace</h2>
            <p className="mt-1 text-slate-600">
              Local Quezon City providers. Verified badge appears automatically based on reputation
              rules.
            </p>
          </div>
          <div className="text-xs text-slate-500">
            Scope: Plumbing · Electrical · General Maintenance
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <label className="grid gap-1">
            <span className="text-xs font-semibold text-slate-700">Search</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Name, skill, barangay…"
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none ring-brand-200 focus:ring-4"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-xs font-semibold text-slate-700">Category</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none ring-brand-200 focus:ring-4"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-xs font-semibold text-slate-700">
              Minimum rating (overall)
            </span>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={5}
                step={0.1}
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full"
              />
              <div className="w-12 text-right text-sm font-semibold text-slate-900">
                {minRating.toFixed(1)}
              </div>
            </div>
          </label>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <label className="grid gap-1">
            <span className="text-xs font-semibold text-slate-700">
              Distance radius (km)
            </span>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={1}
                max={15}
                step={1}
                value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))}
                className="w-full"
              />
              <div className="w-12 text-right text-sm font-semibold text-slate-900">
                {radiusKm}
              </div>
            </div>
          </label>

          <label className="grid gap-1">
            <span className="text-xs font-semibold text-slate-700">Max hourly rate (₱)</span>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={300}
                max={1200}
                step={10}
                value={maxHourlyRate}
                onChange={(e) => setMaxHourlyRate(Number(e.target.value))}
                className="w-full"
              />
              <div className="w-16 text-right text-sm font-semibold text-slate-900">
                {maxHourlyRate}
              </div>
            </div>
          </label>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">Sort</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={`rounded-xl px-3 py-2 text-sm font-semibold ring-1 ${
                    view === 'list'
                      ? 'bg-brand-50 text-brand-800 ring-brand-100'
                      : 'bg-white text-slate-700 ring-slate-200 hover:bg-slate-50'
                  }`}
                  onClick={() => setView('list')}
                >
                  List
                </button>
                <button
                  type="button"
                  className={`rounded-xl px-3 py-2 text-sm font-semibold ring-1 ${
                    view === 'map'
                      ? 'bg-brand-50 text-brand-800 ring-brand-100'
                      : 'bg-white text-slate-700 ring-slate-200 hover:bg-slate-50'
                  }`}
                  onClick={() => setView('map')}
                >
                  Map
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value as SortMode)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none ring-brand-200 focus:ring-4"
              >
                {(['Best match', 'Rating', 'Price (low)', 'Price (high)', 'Distance'] as const).map(
                  (s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ),
                )}
              </select>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={availabilityOnly}
                  onChange={(e) => setAvailabilityOnly(e.target.checked)}
                  className="size-4"
                />
                Available today
              </label>
            </div>
          </div>
        </div>
      </div>

      {view === 'map' ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-7">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-lg font-semibold text-slate-900">Map view (simulated)</div>
              <div className="mt-1 text-sm text-slate-600">
                Pins are colored by rating tier: green ≥4.7, yellow 3.5–4.6, red &lt;3.5.
              </div>
            </div>
            <div className="text-xs text-slate-500">
              Customer location: QC center (demo)
            </div>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <div className="relative h-80 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-brand-50 ring-1 ring-slate-200">
              <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgba(148,163,184,.35)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,.35)_1px,transparent_1px)] [background-size:32px_32px]" />
              {items.slice(0, 10).map((x) => {
                const tier =
                  x.overall >= 4.7 ? 'bg-emerald-500' : x.overall >= 3.5 ? 'bg-amber-400' : 'bg-rose-500'
                // normalize lat/lng to a QC-ish box for display
                const left = ((x.provider.location.lng - 121.02) / (121.10 - 121.02)) * 100
                const top = (1 - (x.provider.location.lat - 14.62) / (14.69 - 14.62)) * 100
                return (
                  <Link
                    key={x.provider.id}
                    to={`/providers/${x.provider.id}`}
                    className="group absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${clampPct(left)}%`, top: `${clampPct(top)}%` }}
                    aria-label={`Open ${x.provider.name}`}
                  >
                    <span className={`block size-3 rounded-full ${tier} ring-4 ring-white`} />
                    <span className="pointer-events-none absolute left-1/2 top-4 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-2 py-1 text-xs text-white group-hover:block">
                      {x.provider.name}
                    </span>
                  </Link>
                )
              })}
              <div
                className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-700 ring-4 ring-white"
                title="You"
              />
            </div>
            <div className="grid gap-3">
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 ring-1 ring-slate-200">
                This is a lightweight placeholder for the SRS “map view” without requiring a Maps API
                key. The distance filter uses real Haversine math against seeded provider coordinates.
              </div>
              <div className="rounded-2xl border border-slate-200 p-5">
                <div className="text-sm font-semibold text-slate-900">Legend</div>
                <div className="mt-3 grid gap-2 text-sm text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="size-3 rounded-full bg-emerald-500 ring-4 ring-white" />
                    Green: ≥ 4.7
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="size-3 rounded-full bg-amber-400 ring-4 ring-white" />
                    Yellow: 3.5 – 4.6
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="size-3 rounded-full bg-rose-500 ring-4 ring-white" />
                    Red: &lt; 3.5
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {view === 'list' ? (
        <div className="grid gap-4">
          {items.map(({ provider }) => (
          <ProviderCard
            key={provider.id}
            provider={provider}
            reviews={state.reviews}
            bookingsCountSource={state.bookings}
          />
        ))}
          {items.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
              No providers match your filters.
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

function clampPct(n: number) {
  return Math.max(3, Math.min(97, n))
}

