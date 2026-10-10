export default function Loading() {
  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">
      {/* Header */}
      <div className="space-y-2 mb-6">
        <div className="animate-pulse bg-slate-200 h-7 w-48 rounded" />
        <div className="animate-pulse bg-slate-100 h-4 w-72 rounded" />
      </div>

      {/* Form card */}
      <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-5">
        {/* Field 1 */}
        <div className="space-y-2">
          <div className="animate-pulse bg-slate-100 h-3 w-24 rounded" />
          <div className="animate-pulse bg-slate-100 h-10 w-full rounded-lg" />
        </div>

        {/* Field 2 */}
        <div className="space-y-2">
          <div className="animate-pulse bg-slate-100 h-3 w-32 rounded" />
          <div className="animate-pulse bg-slate-100 h-10 w-full rounded-lg" />
        </div>

        {/* Two-column fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="animate-pulse bg-slate-100 h-3 w-20 rounded" />
              <div className="animate-pulse bg-slate-100 h-10 w-full rounded-lg" />
            </div>
          ))}
        </div>

        {/* Textarea */}
        <div className="space-y-2">
          <div className="animate-pulse bg-slate-100 h-3 w-28 rounded" />
          <div className="animate-pulse bg-slate-100 h-32 w-full rounded-lg" />
        </div>

        {/* Textarea 2 */}
        <div className="space-y-2">
          <div className="animate-pulse bg-slate-100 h-3 w-32 rounded" />
          <div className="animate-pulse bg-slate-100 h-24 w-full rounded-lg" />
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-3">
          <div className="animate-pulse bg-slate-200 h-10 w-32 rounded-lg" />
          <div className="animate-pulse bg-slate-100 h-10 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  )
}