export function PriceBreakdown({
  calloutFee,
  estimatedHours,
  hourlyRate,
  platformTrustFee,
}: {
  calloutFee: number
  estimatedHours: number
  hourlyRate: number
  platformTrustFee: number
}) {
  const labor = Math.round(estimatedHours * hourlyRate)
  const subtotal = calloutFee + labor
  const total = subtotal + platformTrustFee

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="text-sm font-semibold text-slate-900">Transparent pricing</div>
      <div className="mt-4 grid gap-2 text-sm">
        <Row label="Base callout fee" value={`₱${calloutFee}`} />
        <Row label={`Labor (${estimatedHours.toFixed(1)} hrs × ₱${hourlyRate}/hr)`} value={`₱${labor}`} />
        <div className="my-1 border-t border-slate-200" />
        <Row label="Subtotal" value={`₱${subtotal}`} />
        <Row
          label="Platform trust fee"
          hint="Identity + review constraints + visibility reduce the trust gap."
          value={`₱${platformTrustFee}`}
        />
        <div className="my-1 border-t border-slate-200" />
        <Row label="Total" value={`₱${total}`} strong />
      </div>
      <div className="mt-4 rounded-xl bg-brand-50 p-3 text-xs text-brand-800 ring-1 ring-brand-100">
        No hidden charges: you’ll see a clear breakdown before confirming.
      </div>
    </div>
  )
}

function Row({
  label,
  value,
  hint,
  strong,
}: {
  label: string
  value: string
  hint?: string
  strong?: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className={strong ? 'font-semibold text-slate-900' : 'text-slate-700'}>
          {label}
        </div>
        {hint ? <div className="text-xs text-slate-500">{hint}</div> : null}
      </div>
      <div className={strong ? 'font-semibold text-slate-900' : 'text-slate-900'}>{value}</div>
    </div>
  )
}

