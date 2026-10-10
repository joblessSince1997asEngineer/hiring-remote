export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { getContent } from '@/lib/get-content'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing — Transparent Recruitment Fees',
  description:
    'Flexible pricing: one-time placement fees, flat fee per hire, or annual subscription with up to 50% off per hire. No hidden costs.',
}

export default async function PricingPage() {
  const content = await getContent()
  const t = (k: string) => content[k] ?? ''

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 md:py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-[#0f172a] mb-4">
            {t('pricing.header.title')}
          </h1>
          <p className="text-slate-600 text-base md:text-lg">
            {t('pricing.header.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
          {/* Card 1 */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col">
            <h3 className="text-xl font-bold text-[#0f172a] mb-2">
              {t('pricing.card1.title')}
            </h3>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              {t('pricing.card1.desc')}
            </p>
            <div className="font-semibold text-[#0f172a] mb-4">Percentage Breakdown:</div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-slate-600 text-sm">
                <Check size={16} color="#facc15" />
                <span><strong>Junior Roles:</strong> {t('pricing.card1.juniorPercent')}%</span>
              </li>
              <li className="flex items-center gap-2 text-slate-600 text-sm">
                <Check size={16} color="#facc15" />
                <span><strong>Mid-Level Roles:</strong> {t('pricing.card1.midPercent')}%</span>
              </li>
              <li className="flex items-center gap-2 text-slate-600 text-sm">
                <Check size={16} color="#facc15" />
                <span><strong>Senior or Specialized Roles:</strong> {t('pricing.card1.seniorPercent')}%</span>
              </li>
            </ul>
            <div className="font-semibold text-[#0f172a] mb-2">Example:</div>
            <ul className="text-slate-600 text-sm space-y-1">
              <li>• Candidate&apos;s Monthly Salary: <strong>${t('pricing.card1.exampleMonthly')}</strong></li>
              <li>• Annual Salary: <strong>${t('pricing.card1.exampleAnnual')}</strong></li>
              <li>• Our Fee ({t('pricing.card1.juniorPercent')}%): <strong>${t('pricing.card1.exampleFee')}</strong> (one-time payment)</li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col">
            <h3 className="text-xl font-bold text-[#0f172a] mb-2">
              {t('pricing.card2.title')}
            </h3>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              {t('pricing.card2.desc')}
            </p>
            <div className="font-semibold text-[#0f172a] mb-4">Suggested Pricing:</div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-slate-600 text-sm">
                <Check size={16} color="#facc15" />
                <span><strong>Entry-Level Roles:</strong> ${t('pricing.card2.flatEntry')}</span>
              </li>
              <li className="flex items-center gap-2 text-slate-600 text-sm">
                <Check size={16} color="#facc15" />
                <span><strong>Mid-Level Roles:</strong> ${t('pricing.card2.flatMid')}</span>
              </li>
              <li className="flex items-center gap-2 text-slate-600 text-sm">
                <Check size={16} color="#facc15" />
                <span><strong>Senior or Specialized Roles:</strong> ${t('pricing.card2.flatSenior')}</span>
              </li>
            </ul>
            <div className="text-slate-500 text-sm italic mt-auto">
              {t('pricing.card2.note')}
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#0f172a] border border-slate-200 rounded-3xl p-8 flex flex-col relative">
            <div className="absolute top-3 right-6 bg-[#facc15] text-black text-xs font-bold px-4 py-1 rounded-full">
              MOST POPULAR
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {t('pricing.card3.title')}
            </h3>
            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
              {t('pricing.card3.desc')}
            </p>

            <div className="mb-6">
              <span className="text-4xl font-black text-white">${t('pricing.card3.firstYear')}</span>
              <span className="text-slate-400 text-sm"> / year</span>
              <p className="text-slate-400 text-xs mt-1">
                Renews at ${t('pricing.card3.renewalAmount')}/year ({t('pricing.card3.loyaltyDiscount')}% loyalty discount)
              </p>
            </div>

            <div className="font-semibold text-white mb-4">Choose Your Tier:</div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check size={16} color="#facc15" className="mt-0.5 shrink-0" />
                <span>
                  <strong className="text-white">Starter:</strong> Up to {t('pricing.card3.starterHires')} hires/month — <strong className="text-[#facc15]">{t('pricing.card3.starterDiscount')}% off</strong> per hire
                </span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check size={16} color="#facc15" className="mt-0.5 shrink-0" />
                <span>
                  <strong className="text-white">Growth:</strong> Up to {t('pricing.card3.growthHires')} hires/month — <strong className="text-[#facc15]">{t('pricing.card3.growthDiscount')}% off</strong> per hire
                </span>
              </li>
              <li className="flex items-start gap-2 text-slate-300 text-sm">
                <Check size={16} color="#facc15" className="mt-0.5 shrink-0" />
                <span>
                  <strong className="text-white">Enterprise:</strong> {t('pricing.card3.enterpriseHires')} hires — <strong className="text-[#facc15]">{t('pricing.card3.enterpriseDiscount')}% off</strong> per hire
                </span>
              </li>
            </ul>

            <Link
              href="/contact"
              className="mt-auto block w-full text-center py-4 rounded-full bg-[#facc15] font-bold text-[#0f172a] hover:bg-yellow-300 transition-colors"
            >
              {t('pricing.card3.ctaLabel')}
            </Link>
            <p className="text-center text-xs text-slate-400 mt-3">
              {t('pricing.card3.ctaNote')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}