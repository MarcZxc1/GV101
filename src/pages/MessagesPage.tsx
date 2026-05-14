import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppStore } from "../state/store";

export function MessagesPage() {
  const { bookingId } = useParams();
  const { state, actions } = useAppStore();
  const booking = state.bookings.find((b) => b.id === bookingId);
  const provider = booking
    ? state.providers.find((p) => p.id === booking.providerId)
    : undefined;

  const [text, setText] = useState("");

  const thread = useMemo(() => {
    if (!bookingId) return [];
    return state.messages.filter((m) => m.bookingId === bookingId);
  }, [bookingId, state.messages]);

  if (!bookingId || !booking || !provider) {
    return (
      <div className="card text-sm text-slate-700">
        Message thread not found.
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <section className="section">
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
              className="btn btn-secondary px-4 py-2 text-sm"
            >
              Customer
            </Link>
            <Link
              to="/provider"
              className="btn btn-secondary px-4 py-2 text-sm"
            >
              Provider
            </Link>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-xs text-slate-600 ring-1 ring-slate-200">
          Safety filter demo (SRS FR-35): phone numbers like <b>09XXXXXXXXX</b>{" "}
          and raw links will be redacted automatically.
        </div>
      </section>

      <section className="section">
        <div
          className="grid gap-3"
          role="log"
          aria-live="polite"
          aria-relevant="additions"
        >
          {thread.length === 0 ? (
            <div className="card bg-slate-50 text-sm text-slate-600">
              No messages yet.
            </div>
          ) : (
            thread.map((m) => (
              <div
                key={m.id}
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ring-1 ${
                  m.sender === "customer"
                    ? "ml-auto bg-brand-50 text-slate-800 ring-brand-100"
                    : "mr-auto bg-white text-slate-800 ring-slate-200"
                }`}
              >
                <div className="text-xs font-semibold text-slate-600">
                  {m.sender === "customer" ? "Customer" : "Provider"} ·{" "}
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
            className="input sm:col-span-5"
          />
          <button
            type="button"
            className="btn btn-dark h-11 px-4 text-sm"
            onClick={() => {
              const t = text.trim();
              if (!t) return;
              actions.sendMessage({
                bookingId: booking.id,
                sender: state.role,
                text: t,
              });
              setText("");
            }}
          >
            Send
          </button>
        </div>
      </section>
    </div>
  );
}
