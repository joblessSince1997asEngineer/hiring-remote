export const dynamic = 'force-dynamic'
import { FileText, Search, ShieldCheck, Briefcase } from 'lucide-react'
import { getContent } from '@/lib/get-content'

export default async function ProcessPage() {
  const content = await getContent()
  const t = (k: string) => content[k] ?? ''

  const steps = [
    { icon: <FileText size={28} />, title: t('process.step1.title'), desc: t('process.step1.desc') },
    { icon: <Search size={28} />, title: t('process.step2.title'), desc: t('process.step2.desc') },
    { icon: <ShieldCheck size={28} />, title: t('process.step3.title'), desc: t('process.step3.desc') },
    { icon: <Briefcase size={28} />, title: t('process.step4.title'), desc: t('process.step4.desc') },
  ]

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 md:py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-[#0f172a] mb-4">
            {t('process.header.title')}
          </h1>
          <p className="text-slate-600 text-base md:text-lg">
            {t('process.header.subtitle')}
          </p>
        </div>

        <div className="relative md:border-l-2 md:border-slate-200 md:ml-6 md:pl-12 space-y-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex md:block justify-center mb-4 md:mb-0 md:absolute md:-left-[58px] md:top-0">
                <div className="w-12 h-12 rounded-full bg-[#fffbeb] border-2 border-[#f59e0b] flex items-center justify-center text-[#f59e0b]">
                  {step.icon}
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm text-center md:text-left">
                <div className="text-[#f59e0b] text-xs font-bold tracking-wider mb-2">
                  STEP {String(index + 1).padStart(2, '0')}
                </div>
                <h3 className="text-xl font-bold text-[#0f172a] mb-3">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}