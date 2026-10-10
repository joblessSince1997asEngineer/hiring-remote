export default function Loading() {
  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">
      {/* Header */}
      <div className="space-y-2 mb-6">
        <div className="animate-pulse bg-slate-200 h-7 w-40 rounded" />
        <div className="animate-pulse bg-slate-100 h-4 w-64 rounded" />
      </div>

      {/* Avatar + name card */}
      <div className="p-5 bg-white border border-slate-200 rounded-xl mb-4">
        <div className="flex items-center gap-4">
          <div className="animate-pulse bg-slate-200 w-20 h-20 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="animate-pulse bg-slate-200 h-5 w-1/3 rounded" />
            <div className="animate-pulse bg-slate-100 h-3 w-1/2 rounded" />
          </div>
        </div>
      </div>

      {/* Form fields */}
      <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="animate-pulse bg-slate-100 h-3 w-24 rounded" />
            <div className="animate-pulse bg-slate-100 h-10 w-full rounded-lg" />
          </div>
        ))}
        <div className="animate-pulse bg-slate-200 h-10 w-32 rounded-lg" />
      </div>
    </div>
  )
}