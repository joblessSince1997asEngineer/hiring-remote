export default function Loading() {
  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="space-y-2">
          <div className="animate-pulse bg-slate-200 h-7 w-52 rounded" />
          <div className="animate-pulse bg-slate-100 h-4 w-64 rounded" />
        </div>
        <div className="animate-pulse bg-slate-200 h-9 w-32 rounded-lg" />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        <div className="animate-pulse bg-slate-200 h-8 w-24 rounded-lg" />
        <div className="animate-pulse bg-slate-100 h-8 w-24 rounded-lg" />
      </div>

      {/* Message list */}
      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="p-4 bg-white border border-slate-200 rounded-xl"
          >
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="animate-pulse bg-slate-200 w-10 h-10 rounded-full shrink-0" />

              {/* Content */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="animate-pulse bg-slate-200 h-4 w-40 rounded" />
                  <div className="animate-pulse bg-slate-100 h-3 w-20 rounded" />
                </div>
                <div className="animate-pulse bg-slate-100 h-3 w-52 rounded" />
                <div className="animate-pulse bg-slate-100 h-3 w-full rounded" />
                <div className="animate-pulse bg-slate-100 h-3 w-2/3 rounded" />
              </div>

              {/* Read pill */}
              <div className="animate-pulse bg-slate-200 h-5 w-14 rounded-full shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}