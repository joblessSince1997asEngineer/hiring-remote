export default function ApplicationsLoading() {
  return (
    <div className="p-6 md:p-10 animate-pulse">
      <div className="mb-8">
        <div className="h-8 w-48 bg-slate-200 rounded mb-2"></div>
        <div className="h-4 w-72 bg-slate-100 rounded"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
        {/* Left: list */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="p-4 border-b border-slate-100">
              <div className="flex justify-between mb-2">
                <div className="h-4 w-24 bg-slate-200 rounded"></div>
                <div className="h-4 w-16 bg-slate-100 rounded-full"></div>
              </div>
              <div className="h-3 w-32 bg-slate-100 rounded mb-1"></div>
              <div className="h-3 w-20 bg-slate-100 rounded"></div>
            </div>
          ))}
        </div>

        {/* Right: detail */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="h-8 w-48 bg-slate-200 rounded mb-3"></div>
          <div className="h-4 w-64 bg-slate-100 rounded mb-6"></div>
          <div className="h-40 bg-slate-50 rounded-xl mb-6"></div>
          <div className="flex gap-3">
            <div className="h-10 w-32 bg-slate-200 rounded-full"></div>
            <div className="h-10 w-32 bg-slate-200 rounded-full"></div>
            <div className="h-10 w-24 bg-slate-200 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  )
}