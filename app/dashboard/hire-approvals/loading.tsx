export default function Loading() {
  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="space-y-2">
          <div className="animate-pulse bg-slate-200 h-7 w-48 rounded" />
          <div className="animate-pulse bg-slate-100 h-4 w-72 rounded" />
        </div>
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

      {/* Approval cards */}
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-4 bg-white border border-slate-200 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="animate-pulse bg-slate-200 w-12 h-12 rounded-full shrink-0" />

              <div className="flex-1 min-w-0 space-y-2">
                <div className="animate-pulse bg-slate-200 h-4 w-1/3 rounded" />
                <div className="animate-pulse bg-slate-100 h-3 w-1/2 rounded" />

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-2">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="space-y-1">
                      <div className="animate-pulse bg-slate-100 h-3 w-16 rounded" />
                      <div className="animate-pulse bg-slate-200 h-4 w-24 rounded" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="animate-pulse bg-slate-200 h-6 w-20 rounded-full shrink-0" />
            </div>

            <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
              <div className="animate-pulse bg-slate-200 h-9 w-28 rounded-lg" />
              <div className="animate-pulse bg-slate-100 h-9 w-28 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}