export default function Loading() {
  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="space-y-2">
          <div className="animate-pulse bg-slate-200 h-7 w-40 rounded" />
          <div className="animate-pulse bg-slate-100 h-4 w-56 rounded" />
        </div>
        <div className="animate-pulse bg-slate-200 h-6 w-24 rounded-full" />
      </div>

      {/* Invoice card */}
      <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-5">
        {/* Top row */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="animate-pulse bg-slate-200 h-5 w-32 rounded" />
            <div className="animate-pulse bg-slate-100 h-3 w-40 rounded" />
          </div>
          <div className="animate-pulse bg-slate-200 h-8 w-24 rounded" />
        </div>

        {/* Line items */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="animate-pulse bg-slate-100 h-4 w-1/3 rounded" />
              <div className="animate-pulse bg-slate-100 h-4 w-20 rounded" />
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <div className="animate-pulse bg-slate-200 h-5 w-20 rounded" />
          <div className="animate-pulse bg-slate-200 h-6 w-28 rounded" />
        </div>

        {/* Pay button */}
        <div className="animate-pulse bg-slate-200 h-11 w-full rounded-lg" />
      </div>
    </div>
  )
}