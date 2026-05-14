export function PageLoader({ label = "Loading content" }: { label?: string }) {
  return (
    <div
      className="grid gap-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
    >
      <section className="section">
        <div className="h-6 w-48 skeleton skeleton-rounded" />
        <div className="mt-4 grid gap-2">
          <div className="h-4 w-full skeleton skeleton-rounded" />
          <div className="h-4 w-5/6 skeleton skeleton-rounded" />
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-8 w-24 skeleton skeleton-rounded" />
          ))}
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="card">
            <div className="h-5 w-32 skeleton skeleton-rounded" />
            <div className="mt-3 h-4 w-full skeleton skeleton-rounded" />
            <div className="mt-2 h-4 w-4/5 skeleton skeleton-rounded" />
            <div className="mt-5 h-10 w-36 skeleton skeleton-rounded" />
          </div>
        ))}
      </section>
    </div>
  );
}
