import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAppStore } from '../state/store'

export function MessagesPage() {
  const { bookingId } = useParams()
  const { state, actions } = useAppStore()
  const booking = state.bookings.find((b) => b.id === bookingId)
  const provider = booking ? state.providers.find((p) => p.id === booking.providerId) : undefined

  const [text, setText] = useState('')

  const thread = useMemo(() => {
    if (!bookingId) return []
    return state.messages.filter((m) => m.bookingId === bookingId)
  }, [bookingId, state.messages])

  if (!bookingId || !booking || !provider) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700">
        Message thread not found.
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-7">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Messages</h2>
            <div className="mt-1 text-slate-600">
              Booking {booking.id.slice(0, 8)} · {provider.name}
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              to="/customer"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Customer
            </Link>
            <Link
              to="/provider"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Provider
            </Link>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-xs text-slate-600 ring-1 ring-slate-200">
          Safety filter demo (SRS FR-35): phone numbers like <b>09XXXXXXXXX</b> and raw links will be
          redacted automatically.
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-7">
        <div className="grid gap-3">
          {thread.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
              No messages yet.
            </div>
          ) : (
            thread.map((m) => (
              <div
                key={m.id}
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ring-1 ${
                  m.sender === 'customer'
                    ? 'ml-auto bg-brand-50 text-slate-800 ring-brand-100'
                    : 'mr-auto bg-white text-slate-800 ring-slate-200'
                }`}
              >
                <div className="text-xs font-semibold text-slate-600">
                  {m.sender === 'customer' ? 'Customer' : 'Provider'} ·{' '}
                  {new Date(m.createdAt).toLocaleTimeString()}
                </div>
                <div className="mt-1 whitespace-pre-wrap">{m.text}</div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 grid gap-2 sm:grid-cols-6">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message…"
            className="sm:col-span-5 h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none ring-brand-200 focus:ring-4"
          />
          <button
            type="button"
            className="h-11 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800"
            onClick={() => {
              const t = text.trim()
              if (!t) return
              actions.sendMessage({
                bookingId: booking.id,
                sender: state.role,
                text: t,
              })
              setText('')
            }}
          >
            Send
          </button>
        </div>
      </section>
    </div>
  )
}

