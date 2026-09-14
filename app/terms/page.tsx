export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-4xl font-bold text-[#0f172a] mb-2">Terms of Service</h1>
        <p className="text-slate-500 mb-8">Last Updated: September 2026</p>

        <div className="space-y-6 text-slate-700 leading-relaxed">
          <div>
            <h2 className="text-xl font-bold text-[#0f172a] mb-2">1. Acceptance of Terms</h2>
            <p className="text-sm">By accessing or using Remote Hirring, you agree to be bound by these Terms and our Privacy Policy.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#0f172a] mb-2">2. Client Responsibilities</h2>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>You must provide accurate information when posting job requests.</li>
              <li>You agree to pay the placement fee upon a successful hire.</li>
              <li>You agree not to directly hire, contact, or bypass the agency for any candidate shown in the masked Client Dashboard without paying the required fee.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#0f172a] mb-2">3. Candidate Responsibilities</h2>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>You agree that the information you provide, including your CV, is accurate and truthful.</li>
              <li>Your CV remains your property, but you grant us permission to share it with vetted clients.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#0f172a] mb-2">4. Intellectual Property</h2>
            <p className="text-sm">The Remote Hirring branding, logo, and platform code are protected. You agree not to copy, reverse-engineer, or misuse the platform.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#0f172a] mb-2">5. Limitation of Liability</h2>
            <p className="text-sm">Remote Hirring acts as a matchmaking agency. We are not liable for final employment decisions made between clients and candidates, nor for any disputes arising after the hiring process.</p>
          </div>
        </div>
      </div>
    </div>
  )
}