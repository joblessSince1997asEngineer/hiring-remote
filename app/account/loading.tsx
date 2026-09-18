export default function AccountLoading() {
  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 md:py-12 px-4 animate-pulse">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header card */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-slate-200"></div>
            <div className="flex-1">
              <div className="h-7 w-40 bg-slate-200 rounded mb-2"></div>
              <div className="h-4 w-56 bg-slate-100 rounded"></div>
            </div>
          </div>
        </div>

        {/* Content cards */}
        {[1, 2].map(i => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8">
            <div className="h-6 w-40 bg-slate-200 rounded mb-5"></div>
            <div className="space-y-3">
              <div className="h-16 bg-slate-50 rounded-xl"></div>
              <div className="h-16 bg-slate-50 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}