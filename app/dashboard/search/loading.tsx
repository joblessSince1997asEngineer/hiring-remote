export default function Loading() {
  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="animate-pulse bg-slate-200 h-7 w-40 rounded mb-4" />

      {/* Search input */}
      <div className="animate-pulse bg-slate-100 h-11 w-full rounded-lg mb-6" />

      {/* Results label */}
      <div className="animate-pulse bg-slate-100 h-3 w-32 rounded mb-3" />

      {/* Candidate cards */}
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-4 bg-white border border-slate-200 rounded-xl"
          >
            <div className="animate-pulse bg-slate-200 w-10 h-10 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="animate-pulse bg-slate-200 h-4 w-1/3 rounded" />
              <div className="animate-pulse bg-slate-100 h-3 w-2/3 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}