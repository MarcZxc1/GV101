import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppStore } from '../state/store'
import type { ProviderVerificationStatus } from '../state/types'

export function AdminDashboardPage() {
  const { state, actions } = useAppStore()
  const [selectedProviderId, setSelectedProviderId] = useState<string>(state.providers[0]?.id ?? '')
  const [flagReviewId, setFlagReviewId] = useState<string>('')
  const [nextStatus, setNextStatus] = useState<ProviderVerificationStatus>('approved')

  const provider = state.providers.find((p) => p.id === selectedProviderId)

  const flagged = useMemo(() => {
    return state.reviews
      .filter((r) => r.flags.count > 0)
      .sort((a, b) => b.flags.count - a.flags.count)
  }, [state.reviews])

  return (
    <div className="grid gap-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-7">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Admin Dashboard (demo)</h2>
            <p className="mt-1 text-slate-600">
              Lightweight UI to demonstrate SRS admin concepts (verification + moderation) without a backend.
            </p>
          </div>
          <Link
            to="/"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Back to app
          </Link>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-7">
        <div className="text-lg font-semibold text-slate-900">Provider verification (simulated)</div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="grid gap-1">
            <span className="text-xs font-semibold text-slate-700">Select provider</span>
            <select
              value={selectedProviderId}
              onChange={(e) => setSelectedProviderId(e.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none ring-brand-200 focus:ring-4"
            >
              {state.providers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.verificationStatus})
                </option>
              ))}
            </select>
          </label>
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 ring-1 ring-slate-200">
            <div className="text-xs font-semibold text-slate-600">Note</div>
            <div className="mt-1">
              This demo doesn’t persist admin decisions yet (no backend). If you want, I’ll wire admin
              actions into the in-memory store next.
            </div>
          </div>
        </div>
        {provider ? (
          <div className="mt-4 rounded-2xl border border-slate-200 p-5">
            <div className="text-sm font-semibold text-slate-900">{provider.name}</div>
            <div className="mt-1 text-sm text-slate-600">
              Status: <b>{provider.verificationStatus}</b> · Category: {provider.category} · Barangay:{' '}
              {provider.barangay}
            </div>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700">Set status</span>
                <select
                  value={nextStatus}
                  onChange={(e) => setNextStatus(e.target.value as ProviderVerificationStatus)}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm"
                >
                  {(['approved', 'pending', 'rejected'] as const).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                onClick={() => actions.setProviderVerification(provider.id, nextStatus)}
              >
                Apply
              </button>
            </div>
          </div>
        ) : null}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-7">
        <div className="text-lg font-semibold text-slate-900">Flagged reviews (moderation demo)</div>
        <div className="mt-2 text-sm text-slate-600">
          SRS rule: after <b>3 flags</b>, review should be hidden pending admin decision.
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <label className="grid gap-1 md:col-span-2">
            <span className="text-xs font-semibold text-slate-700">Flag review by ID</span>
            <input
              value={flagReviewId}
              onChange={(e) => setFlagReviewId(e.target.value)}
              placeholder="Paste review id (e.g., rev_1)"
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none ring-brand-200 focus:ring-4"
            />
          </label>
          <button
            type="button"
            className="h-11 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800"
            onClick={() => {
              const id = flagReviewId.trim()
              if (!id) return
              actions.flagReview(id)
              setFlagReviewId('')
            }}
          >
            Flag
          </button>
        </div>

        <div className="mt-5 grid gap-3">
          {flagged.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
              No flagged reviews yet.
            </div>
          ) : (
            flagged.map((r) => (
              <div key={r.id} className="rounded-2xl border border-slate-200 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-slate-900">Review {r.id}</div>
                  <div className="text-xs text-slate-500">
                    Flags: <b>{r.flags.count}</b> · Hidden: <b>{String(r.flags.hidden)}</b>
                  </div>
                </div>
                <div className="mt-2 text-sm text-slate-700">{r.remarks}</div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}

