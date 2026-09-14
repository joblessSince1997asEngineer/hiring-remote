import { Check } from 'lucide-react'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 md:py-16 px-4">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-[#0f172a] mb-4">Our Pricing Models</h1>
          <p className="text-slate-600 text-base md:text-lg">Clear, transparent fee structures designed to scale with your hiring needs.</p>
        </div>

        {/* Pricing Cards: Stacks on Mobile, 3 Columns on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
          
          {/* Card 1: One-Time Placement Fee */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col">
            <h3 className="text-xl font-bold text-[#0f172a] mb-2">1. One-Time Placement Fee</h3>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              We charge a one-time percentage of the candidate's annual salary after a successful hire.
            </p>
            <div className="font-semibold text-[#0f172a] mb-4">Percentage Breakdown:</div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-slate-600 text-sm">
                <Check size={16} color="#facc15" /> <strong>Junior Roles:</strong> 15%
              </li>
              <li className="flex items-center gap-2 text-slate-600 text-sm">
                <Check size={16} color="#facc15" /> <strong>Mid-Level Roles:</strong> 25%
              </li>
              <li className="flex items-center gap-2 text-slate-600 text-sm">
                <Check size={16} color="#facc15" /> <strong>Senior or Specialized Roles:</strong> 40%
              </li>
            </ul>
            <div className="font-semibold text-[#0f172a] mb-2">Example:</div>
            <ul className="text-slate-600 text-sm space-y-1">
              <li>• Candidate's Monthly Salary: <strong>$1,000</strong></li>
              <li>• Annual Salary: <strong>$12,000</strong></li>
              <li>• Our Fee (15%): <strong>$1,800</strong> (one-time payment)</li>
            </ul>
          </div>

          {/* Card 2: Flat Fee Per Hire (The Dark/Highlighted Card) */}
          <div className="bg-[#0f172a] border border-slate-200 rounded-3xl p-8 flex flex-col relative">
            <div className="absolute top-3 right-6 bg-[#facc15] text-black text-xs font-bold px-4 py-1 rounded-full">
              MOST POPULAR
            </div>
            <h3 className="text-xl font-bold text-white mb-2">2. Flat Fee Per Hire</h3>
            <p className="text-slate-300 text-sm mb-6 leading-relaxed">Ideal for startups and companies hiring remote employees.</p>
            <div className="font-semibold text-white mb-4">Suggested Pricing:</div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-slate-300 text-sm">
                <Check size={16} color="#facc15" /> <strong>Entry-Level Roles:</strong> $300
              </li>
              <li className="flex items-center gap-2 text-slate-300 text-sm">
                <Check size={16} color="#facc15" /> <strong>Mid-Level Roles:</strong> $500
              </li>
              <li className="flex items-center gap-2 text-slate-300 text-sm">
                <Check size={16} color="#facc15" /> <strong>Senior or Specialized Roles:</strong> $1,000
              </li>
            </ul>
            <button className="w-full py-4 rounded-full bg-[#facc15] font-bold text-[#0f172a] cursor-pointer">
              Choose Flat Fee
            </button>
          </div>

          {/* Card 3: Monthly Recruitment Subscription */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col">
            <h3 className="text-xl font-bold text-[#0f172a] mb-2">3. Monthly Recruitment Subscription</h3>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">For businesses hiring regularly, we offer monthly recruitment plans.</p>
            <div className="font-semibold text-[#0f172a] mb-4">Example Packages:</div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-slate-600 text-sm">
                <Check size={16} color="#facc15" /> <strong>Starter Plan:</strong> Up to 3 hires/month
              </li>
              <li className="flex items-center gap-2 text-slate-600 text-sm">
                <Check size={16} color="#facc15" /> <strong>Growth Plan:</strong> Up to 10 hires/month
              </li>
              <li className="flex items-center gap-2 text-slate-600 text-sm">
                <Check size={16} color="#facc15" /> <strong>Enterprise Plan:</strong> Unlimited hiring with dedicated recruitment support
              </li>
            </ul>
            <div className="text-slate-600 text-sm italic mt-auto">
              *(Custom pricing based on hiring volume.)*
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}