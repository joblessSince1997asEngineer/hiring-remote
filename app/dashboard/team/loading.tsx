export default function Loading() {
  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="space-y-2">
          <div className="animate-pulse bg-slate-200 h-7 w-40 rounded" />
          <div className="animate-pulse bg-slate-100 h-4 w-64 rounded" />
        </div>
        <div className="animate-pulse bg-slate-200 h-9 w-36 rounded-lg" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-4 bg-white border border-slate-200 rounded-xl">
            <div className="animate-pulse bg-slate-100 h-3 w-20 rounded mb-2" />
            <div className="animate-pulse bg-slate-200 h-6 w-12 rounded" />
          </div>
        ))}
      </div>

      {/* Team member cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="p-5 bg-white border border-slate-200 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="animate-pulse bg-slate-200 w-12 h-12 rounded-full shrink-0" />
              <div className="flex-1 space-y-2 min-w-0">
                <div className="animate-pulse bg-slate-200 h-4 w-2/3 rounded" />
                <div className="animate-pulse bg-slate-100 h-3 w-1/2 rounded" />
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="animate-pulse bg-slate-100 h-3 w-3/4 rounded" />
              <div className="animate-pulse bg-slate-100 h-3 w-2/3 rounded" />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="animate-pulse bg-slate-200 h-5 w-16 rounded-full" />
              <div className="animate-pulse bg-slate-200 h-7 w-16 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}