export default function Loading() {
  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="space-y-2">
          <div className="animate-pulse bg-slate-200 h-7 w-44 rounded" />
          <div className="animate-pulse bg-slate-100 h-4 w-60 rounded" />
        </div>
        <div className="animate-pulse bg-slate-200 h-9 w-32 rounded-lg" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-4 bg-white border border-slate-200 rounded-xl">
            <div className="animate-pulse bg-slate-100 h-3 w-24 rounded mb-2" />
            <div className="animate-pulse bg-slate-200 h-6 w-14 rounded" />
          </div>
        ))}
      </div>

      {/* Request list */}
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-4 bg-white border border-slate-200 rounded-xl">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="space-y-2 flex-1">
                <div className="animate-pulse bg-slate-200 h-5 w-1/3 rounded" />
                <div className="animate-pulse bg-slate-100 h-3 w-1/2 rounded" />
              </div>
              <div className="animate-pulse bg-slate-200 h-6 w-24 rounded-full" />
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="animate-pulse bg-slate-100 h-5 w-20 rounded-full" />
              ))}
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="animate-pulse bg-slate-100 h-4 w-28 rounded" />
              <div className="animate-pulse bg-slate-200 h-8 w-24 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}