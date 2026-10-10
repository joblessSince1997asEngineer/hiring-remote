export default function Loading() {
  return (
    <div className="p-6 md:p-10 bg-[#f8fafc] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="space-y-2">
          <div className="animate-pulse bg-slate-200 h-7 w-56 rounded" />
          <div className="animate-pulse bg-slate-100 h-4 w-72 rounded" />
        </div>
        <div className="flex gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-slate-200 h-8 w-16 rounded-lg" />
          ))}
        </div>
      </div>

      {/* 6 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4">
            <div className="animate-pulse bg-slate-200 h-3 w-16 rounded mb-3" />
            <div className="animate-pulse bg-slate-200 h-6 w-12 rounded" />
          </div>
        ))}
      </div>

      {/* Conversion Rate banner */}
      <div className="mb-6 p-4 bg-white border border-slate-200 rounded-xl">
        <div className="animate-pulse bg-slate-100 h-3 w-48 rounded mb-2" />
        <div className="animate-pulse bg-slate-200 h-7 w-20 rounded" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Line chart full width */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 lg:col-span-2">
          <div className="animate-pulse bg-slate-200 h-4 w-48 rounded mb-4" />
          <div className="animate-pulse bg-slate-100 h-[280px] w-full rounded" />
        </div>

        {/* Bar chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <div className="animate-pulse bg-slate-200 h-4 w-40 rounded mb-4" />
          <div className="animate-pulse bg-slate-100 h-[260px] w-full rounded" />
        </div>

        {/* Pie chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <div className="animate-pulse bg-slate-200 h-4 w-40 rounded mb-4" />
          <div className="animate-pulse bg-slate-100 h-[260px] w-full rounded" />
        </div>
      </div>
    </div>
  )
}