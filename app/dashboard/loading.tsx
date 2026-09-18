export default function DashboardLoading() {
  return (
    <div className="p-6 md:p-10 animate-pulse">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-8 w-48 bg-slate-200 rounded mb-2"></div>
        <div className="h-4 w-72 bg-slate-100 rounded"></div>
      </div>

      {/* KPI grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200">
            <div className="w-12 h-12 bg-slate-200 rounded-xl mb-4"></div>
            <div className="h-8 w-16 bg-slate-200 rounded mb-2"></div>
            <div className="h-4 w-24 bg-slate-100 rounded"></div>
          </div>
        ))}
      </div>

      {/* Content panel skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
          <div className="h-6 w-40 bg-slate-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-full shrink-0"></div>
                <div className="flex-1">
                  <div className="h-4 w-32 bg-slate-200 rounded mb-2"></div>
                  <div className="h-3 w-48 bg-slate-100 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="h-6 w-32 bg-slate-200 rounded mb-6"></div>
          <div className="space-y-3">
            <div className="h-12 bg-slate-100 rounded-lg"></div>
            <div className="h-12 bg-slate-100 rounded-lg"></div>
            <div className="h-12 bg-slate-100 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  )
}