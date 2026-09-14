export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-4xl font-bold text-[#0f172a] mb-2">Cookie Policy</h1>
        <p className="text-slate-500 mb-8">Last Updated: September 2026</p>

        <div className="space-y-6 text-slate-700 leading-relaxed">
          <div>
            <h2 className="text-xl font-bold text-[#0f172a] mb-2">What Are Cookies?</h2>
            <p className="text-sm">Cookies are small text files stored on your browser that help websites remember your preferences and keep you logged in.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#0f172a] mb-2">Cookies We Use</h2>
            <div className="space-y-3 text-sm">
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="font-semibold">Essential: Session Cookie (userId)</p>
                <p className="text-slate-600">Required to keep you logged in and deliver your personalized Avatar menu and dashboard access. Without this, you cannot use the platform.</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#0f172a] mb-2">Analytics</h2>
            <p className="text-sm">We currently do NOT run intrusive tracking cookies. If we add analytics in the future, this policy will be updated.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#0f172a] mb-2">Managing Cookies</h2>
            <p className="text-sm">You can clear or disable cookies through your browser settings. Note that disabling the session cookie will prevent you from logging in.</p>
          </div>
        </div>
      </div>
    </div>
  )
}