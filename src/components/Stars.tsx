export function Stars({
  value,
  size = 16,
}: {
  value: number
  size?: number
}) {
  const full = Math.floor(value)
  const frac = value - full
  const stars = Array.from({ length: 5 }, (_, i) => {
    const idx = i + 1
    const fill =
      idx <= full ? 1 : idx === full + 1 ? Math.max(0, Math.min(1, frac)) : 0
    return fill
  })

  return (
    <div className="flex items-center gap-0.5" aria-label={`${value.toFixed(1)} out of 5`}>
      {stars.map((fill, i) => (
        <span key={i} className="relative" style={{ width: size, height: size }}>
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            className="text-slate-300"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 17.3l-6.18 3.64 1.64-7.03-5.46-4.73 7.19-.62L12 2l2.81 9.56 7.19.62-5.46 4.73 1.64 7.03L12 17.3z" />
          </svg>
          <span
            className="absolute inset-0 overflow-hidden text-amber-400"
            style={{ width: `${fill * 100}%` }}
          >
            <svg
              width={size}
              height={size}
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 17.3l-6.18 3.64 1.64-7.03-5.46-4.73 7.19-.62L12 2l2.81 9.56 7.19.62-5.46 4.73 1.64 7.03L12 17.3z" />
            </svg>
          </span>
        </span>
      ))}
    </div>
  )
}

