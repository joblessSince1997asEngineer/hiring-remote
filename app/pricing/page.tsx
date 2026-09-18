import Link from 'next/link'
import { Check } from 'lucide-react'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 md:py-16 px-4">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-[#0f172a] mb-4">Our Pricing Models</h1>
          <p className="text-slate-600 text-base md:text-lg">
            Clear, transparent fee structures designed to scale with your hiring needs.
          </p>
        </div>

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

          {/* Card 2: Flat Fee Per Hire */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col">
            <h3 className="text-xl font-bold text-[#0f172a] mb-2">2. Flat Fee Per Hire</h3>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              Ideal for startups and companies hiring remote employees. Pay a fixed fee per placement.
            </p>
            <div className="font-semibold text-[#0f172a] mb-4">Suggested Pricing:</div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-slate-600 text-sm">
                <Check size={16} color="#facc15" /> <strong>Entry-Level Roles:</strong> $300
              </li>
              <li className="flex items-center gap-2 text-slate-600 text-sm">
                <Check size={16} color="#facc15" /> <strong>Mid-Level Roles:</strong> $500
              </li>
              <li className="flex items-center gap-2 text-slate-600 text-sm">
                <Check size={16} color="#facc15" /> <strong>Senior or Specialized Roles:</strong> $1,000
              </li>
            </ul>
            <div className="text-slate-500 text-sm italic mt-auto">
              *(No subscription required — pay per hire.)*
            </div>
          </div>

          {/* Card 3: Annual Subscription (HIGHLIGHTED) */}
          <div className="bg-[#0f172a] border border-slate-200 rounded-3xl p-8 flex flex-col relative">
            <div className="absolute top-3 right-6 bg-[#facc15] text-black text-xs font-bold px-4 py-1 rounded-full">
              MOST POPULAR
            </div>
            <h3 className="text-xl font-bold text-white mb-2">3. Annual Subscription</h3>
            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
              Unlock discounts on every hire and build your remote team faster.
            </p>

            <div className="mb-6">
              <span className="text-4xl font-black text-white">$5,000</span>
              <span className="text-slate-400 text-sm"> / year</span>
              <p className="text-slate-400 text-xs mt-1">Renews at $4,000/year (20% loyalty discount)</p>
            </div>

            <div className="font-semibold text-white mb-4">Choose Your Tier:</div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check size={16} color="#facc15" className="mt-0.5 shrink-0" />
                <span><strong className="text-white">Starter:</strong> Up to 3 hires/month — <strong className="text-[#facc15]">50% off</strong> per hire</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check size={16} color="#facc15" className="mt-0.5 shrink-0" />
                <span><strong className="text-white">Growth:</strong> Up to 10 hires/month — <strong className="text-[#facc15]">25% off</strong> per hire</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check size={16} color="#facc15" className="mt-0.5 shrink-0" />
                <span><strong className="text-white">Enterprise:</strong> Unlimited hires — <strong className="text-[#facc15]">15% off</strong> per hire</span>
              </li>
            </ul>

            <Link
              href="/contact"
              className="mt-auto block w-full text-center py-4 rounded-full bg-[#facc15] font-bold text-[#0f172a] hover:bg-yellow-300 transition-colors"
            >
              Contact Us to Subscribe
            </Link>

            <p className="text-center text-xs text-slate-400 mt-3">
              Online subscription coming soon
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}