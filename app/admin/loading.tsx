export default function Loading() {
  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="space-y-2">
          <div className="animate-pulse bg-slate-200 h-7 w-48 rounded" />
          <div className="animate-pulse bg-slate-100 h-4 w-64 rounded" />
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-4 bg-white border border-slate-200 rounded-xl">
            <div className="animate-pulse bg-slate-100 h-3 w-20 rounded mb-2" />
            <div className="animate-pulse bg-slate-200 h-7 w-16 rounded" />
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-4 gap-4 px-4 py-3 bg-slate-50 border-b border-slate-200">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-slate-200 h-3 w-20 rounded" />
          ))}
        </div>

        {/* Table rows */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="grid grid-cols-4 gap-4 px-4 py-3 border-b border-slate-100 last:border-b-0">
            {[...Array(4)].map((_, j) => (
              <div key={j} className="animate-pulse bg-slate-100 h-4 w-3/4 rounded" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}