export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-4xl font-bold text-[#0f172a] mb-2">Privacy Policy</h1>
        <p className="text-slate-500 mb-8">Last Updated: September 2026</p>

        <div className="space-y-6 text-slate-700 leading-relaxed">
          <p>Remote Hirring ("we", "our", "us") is committed to protecting your privacy. This Policy explains what personal data we collect, how we use it, and the rights you have over it.</p>

          <div>
            <h2 className="text-xl font-bold text-[#0f172a] mb-2">Information We Collect</h2>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li><strong>Account Data:</strong> Email address, hashed password, and selected role.</li>
              <li><strong>Application Data:</strong> CV file, cover letter, skills, expected salary, timezone, and name.</li>
              <li><strong>Client Data:</strong> Company name, contact email, job requirements, and budget.</li>
              <li><strong>Usage Data:</strong> Basic IP address and browser information for security.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#0f172a] mb-2">How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>To create and manage your account.</li>
              <li>To match candidates with global job opportunities.</li>
              <li>To enable clients to review masked profiles and conduct interviews.</li>
              <li>To send transactional emails (interview requests, invoices, password resets).</li>
              <li>To calculate and generate invoices for successful hires.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#0f172a] mb-2">Third-Party Services</h2>
            <p className="text-sm">We use trusted third-party services to run our platform:</p>
            <ul className="list-disc pl-6 space-y-1 text-sm mt-2">
              <li><strong>Supabase:</strong> For secure data and file storage.</li>
              <li><strong>Vercel:</strong> For website hosting.</li>
              <li><strong>Resend:</strong> For transactional email delivery.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#0f172a] mb-2">Data Security</h2>
            <p className="text-sm">We implement strict Row Level Security (RLS) policies to ensure that clients cannot see candidate emails, and vice versa. All data is encrypted in transit.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#0f172a] mb-2">Your Rights</h2>
            <p className="text-sm">You may request to view, update, or delete your personal data at any time by contacting us at hello@hiringremote.com.</p>
          </div>
        </div>
      </div>
    </div>
  )
}