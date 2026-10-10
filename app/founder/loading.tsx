export default function Loading() {
  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="space-y-2 mb-6">
        <div className="animate-pulse bg-slate-200 h-7 w-52 rounded" />
        <div className="animate-pulse bg-slate-100 h-4 w-72 rounded" />
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="p-4 bg-white border border-slate-200 rounded-xl">
            <div className="animate-pulse bg-slate-100 h-3 w-20 rounded mb-2" />
            <div className="animate-pulse bg-slate-200 h-6 w-14 rounded" />
          </div>
        ))}
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4">
            <div className="animate-pulse bg-slate-200 h-4 w-40 rounded mb-4" />
            <div className="space-y-3">
              {[...Array(5)].map((_, j) => (
                <div key={j} className="flex items-center gap-3">
                  <div className="animate-pulse bg-slate-200 w-9 h-9 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="animate-pulse bg-slate-100 h-3 w-1/2 rounded" />
                    <div className="animate-pulse bg-slate-100 h-3 w-1/3 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}