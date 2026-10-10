export default function Loading() {
  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="space-y-2">
          <div className="animate-pulse bg-slate-200 h-7 w-40 rounded" />
          <div className="animate-pulse bg-slate-100 h-4 w-56 rounded" />
        </div>
        <div className="animate-pulse bg-slate-200 h-9 w-28 rounded-lg" />
      </div>

      {/* Search + filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="animate-pulse bg-slate-100 h-9 w-72 rounded-lg" />
        <div className="animate-pulse bg-slate-100 h-9 w-24 rounded-lg" />
        <div className="animate-pulse bg-slate-100 h-9 w-24 rounded-lg" />
      </div>

      {/* Job cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="p-5 bg-white border border-slate-200 rounded-xl space-y-3"
          >
            {/* Title */}
            <div className="animate-pulse bg-slate-200 h-5 w-3/4 rounded" />
            {/* Company */}
            <div className="animate-pulse bg-slate-100 h-4 w-1/2 rounded" />

            {/* Tags */}
            <div className="flex gap-2 pt-2">
              <div className="animate-pulse bg-slate-100 h-5 w-16 rounded-full" />
              <div className="animate-pulse bg-slate-100 h-5 w-20 rounded-full" />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="animate-pulse bg-slate-200 h-4 w-20 rounded" />
              <div className="animate-pulse bg-slate-200 h-7 w-20 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}