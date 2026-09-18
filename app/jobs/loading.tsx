export default function JobsLoading() {
  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 animate-pulse">
      <div className="max-w-6xl mx-auto">
        <div className="h-9 w-64 bg-slate-200 rounded mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="h-5 w-40 bg-slate-200 rounded mb-3"></div>
              <div className="h-4 w-32 bg-slate-100 rounded mb-4"></div>
              <div className="h-3 w-full bg-slate-100 rounded mb-2"></div>
              <div className="h-3 w-4/5 bg-slate-100 rounded mb-4"></div>
              <div className="h-8 w-24 bg-slate-200 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}