export default function Loading() {
  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="space-y-2">
          <div className="animate-pulse bg-slate-200 h-7 w-48 rounded" />
          <div className="animate-pulse bg-slate-100 h-4 w-64 rounded" />
        </div>
        <div className="animate-pulse bg-slate-200 h-9 w-32 rounded-lg" />
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="animate-pulse bg-slate-100 h-9 w-64 rounded-lg" />
        <div className="animate-pulse bg-slate-100 h-9 w-32 rounded-lg" />
        <div className="animate-pulse bg-slate-100 h-9 w-32 rounded-lg" />
      </div>

      {/* Candidate cards */}
      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl"
          >
            <div className="animate-pulse bg-slate-200 w-12 h-12 rounded-full shrink-0" />
            <div className="flex-1 space-y-2 min-w-0">
              <div className="animate-pulse bg-slate-200 h-4 w-1/3 rounded" />
              <div className="animate-pulse bg-slate-100 h-3 w-2/3 rounded" />
              <div className="flex gap-2 mt-2">
                <div className="animate-pulse bg-slate-100 h-5 w-16 rounded-full" />
                <div className="animate-pulse bg-slate-100 h-5 w-20 rounded-full" />
              </div>
            </div>
            <div className="animate-pulse bg-slate-200 h-8 w-20 rounded-lg shrink-0" />
          </div>
        ))}
      </div>
    </div>
  )
}