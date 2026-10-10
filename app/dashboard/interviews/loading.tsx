export default function Loading() {
  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="space-y-2">
          <div className="animate-pulse bg-slate-200 h-7 w-44 rounded" />
          <div className="animate-pulse bg-slate-100 h-4 w-64 rounded" />
        </div>
        <div className="animate-pulse bg-slate-200 h-9 w-36 rounded-lg" />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse bg-slate-100 h-8 w-20 rounded-lg" />
        ))}
      </div>

      {/* Interview cards */}
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="p-4 bg-white border border-slate-200 rounded-xl"
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="animate-pulse bg-slate-200 w-11 h-11 rounded-full shrink-0" />

              {/* Main info */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="animate-pulse bg-slate-200 h-4 w-1/3 rounded" />
                <div className="animate-pulse bg-slate-100 h-3 w-1/2 rounded" />

                <div className="flex gap-3 pt-2">
                  <div className="animate-pulse bg-slate-100 h-4 w-28 rounded" />
                  <div className="animate-pulse bg-slate-100 h-4 w-24 rounded" />
                </div>
              </div>

              {/* Status pill */}
              <div className="animate-pulse bg-slate-200 h-6 w-20 rounded-full shrink-0" />
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
              <div className="animate-pulse bg-slate-200 h-8 w-24 rounded-lg" />
              <div className="animate-pulse bg-slate-100 h-8 w-24 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}