import { Link } from 'react-router-dom'

export function LandingPage() {
  return (
    <div className="grid gap-8">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <div className="grid gap-8 p-8 md:grid-cols-2 md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-800 ring-1 ring-brand-100">
              Quezon City Beta · Verified reputation signals
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              Close the <span className="text-brand-700">Trust Gap</span> in home repairs.
            </h1>
            <p className="mt-3 text-slate-600">
              HandiLink matches homeowners with local tradespeople using reputation as currency:
              multi-dimensional ratings, deep reviews, and photo evidence that builds confidence.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/marketplace"
                className="rounded-2xl bg-brand-600 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-brand-700"
              >
                Find a verified pro
              </Link>
              <Link
                to="/customer"
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Go to Customer Portal
              </Link>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <Feature title="3-click booking" desc="Search → pick → confirm in minutes." />
              <Feature title="No pricing anxiety" desc="Transparent breakdown before you commit." />
              <Feature title="Proof of work" desc="Before/after evidence on completed jobs." />
            </div>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-brand-50 to-emerald-50 p-6 ring-1 ring-slate-200">
            <div className="text-sm font-semibold text-slate-900">How trust is earned</div>
            <ol className="mt-4 grid gap-3 text-sm text-slate-700">
              <li className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                <div className="font-semibold text-slate-900">Verified Ratings</div>
                <div className="mt-1 text-slate-600">
                  Punctuality · Technical Skill · Communication (5-star each).
                </div>
              </li>
              <li className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                <div className="font-semibold text-slate-900">Deep Review Constraints</div>
                <div className="mt-1 text-slate-600">
                  Remarks require 50+ characters to encourage useful feedback.
                </div>
              </li>
              <li className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                <div className="font-semibold text-slate-900">Verified Badge Logic</div>
                <div className="mt-1 text-slate-600">
                  Auto badge for providers with &gt;4.7 overall and zero no-show flags.
                </div>
              </li>
            </ol>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card
          title="Customer Portal"
          desc="Track active bookings and your history. Leave verified reviews after completion."
          cta="Open customer dashboard"
          to="/customer"
        />
        <Card
          title="Provider Portal"
          desc="Manage job requests, complete jobs, and build your digital reputation with evidence."
          cta="Open provider dashboard"
          to="/provider"
        />
      </section>
    </div>
  )
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <div className="mt-1 text-sm text-slate-600">{desc}</div>
    </div>
  )
}

function Card({
  title,
  desc,
  cta,
  to,
}: {
  title: string
  desc: string
  cta: string
  to: string
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-7">
      <div className="text-lg font-semibold text-slate-900">{title}</div>
      <div className="mt-2 text-slate-600">{desc}</div>
      <div className="mt-5">
        <Link
          to={to}
          className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
        >
          {cta}
        </Link>
      </div>
    </div>
  )
}

