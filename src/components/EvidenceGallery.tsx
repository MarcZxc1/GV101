import type { JobEvidence } from '../state/types'

export function EvidenceGallery({ evidence }: { evidence: JobEvidence[] }) {
  if (evidence.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
        No before/after evidence uploaded yet.
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {evidence.map((ev) => (
        <div
          key={ev.id}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            <figure className="border-b border-slate-200 md:border-b-0 md:border-r">
              <img src={ev.beforeUrl} alt="Before" className="h-56 w-full object-cover" />
              <figcaption className="px-4 py-3 text-xs font-medium text-slate-600">
                Before
              </figcaption>
            </figure>
            <figure>
              <img src={ev.afterUrl} alt="After" className="h-56 w-full object-cover" />
              <figcaption className="px-4 py-3 text-xs font-medium text-slate-600">
                After
              </figcaption>
            </figure>
          </div>
          {ev.caption ? (
            <div className="border-t border-slate-200 px-4 py-3 text-sm text-slate-700">
              {ev.caption}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  )
}

