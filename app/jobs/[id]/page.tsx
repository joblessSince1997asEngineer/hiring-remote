import { getJob } from '@/lib/queries'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Briefcase, DollarSign, Clock, Calendar } from 'lucide-react'
import ApplySection from '@/components/ApplySection'

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const job = await getJob(id)
  if (!job) return notFound()

  const currencySymbol = job.currency === 'EUR' ? '€' : job.currency === 'GBP' ? '£' : job.currency === 'PKR' ? '₨' : job.currency === 'INR' ? '₹' : '$'
  const salaryPeriodLabel = job.salaryPeriod === 'month' ? '/mo' : '/yr'

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-8 md:py-12 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Back link */}
        <Link href="/jobs" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-6 no-underline">
          <ArrowLeft className="w-4 h-4" />
          Back to all jobs
        </Link>

        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm">

                    {/* Header */}
          <div className="bg-[#0f172a] p-6 rounded-xl mb-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{job.title}</h1>
                <p className="text-slate-300">{job.company} • {job.location}</p>
              </div>
              <a
                href="#apply-section"
                className="bg-[#facc15] text-slate-900 px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-yellow-300 transition-colors whitespace-nowrap self-start"
              >
                Apply Now
              </a>
            </div>
            {/* Meta pills */}
            <div className="flex flex-wrap gap-2">
              {job.remoteType && (
                <span className="bg-white/10 text-white px-3 py-1 rounded-full text-xs capitalize">
                  🌐 {job.remoteType}
                </span>
              )}
              {job.type && (
                <span className="bg-white/10 text-white px-3 py-1 rounded-full text-xs">
                  💼 {job.type}
                </span>
              )}
              {job.seniority && (
                <span className="bg-white/10 text-white px-3 py-1 rounded-full text-xs capitalize">
                  📈 {job.seniority}
                </span>
              )}
              {job.salaryMin && job.salaryMax && (
                <span className="bg-[#facc15] text-slate-900 px-3 py-1 rounded-full text-xs font-semibold">
                  💰 {currencySymbol}{job.salaryMin.toLocaleString()}–{currencySymbol}{job.salaryMax.toLocaleString()}{salaryPeriodLabel}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          {job.description && (
            <section className="mb-6">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-3 pb-2 border-b-2 border-yellow-400 inline-block">
                About the Role
              </h2>
              <div className="text-slate-700 whitespace-pre-wrap leading-relaxed text-sm">
                {job.description}
              </div>
            </section>
          )}

          {/* Responsibilities */}
          {job.responsibilities && (
            <section className="mb-6">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-3 pb-2 border-b-2 border-yellow-400 inline-block">
                Responsibilities
              </h2>
              <div className="text-slate-700 whitespace-pre-wrap leading-relaxed text-sm">
                {job.responsibilities}
              </div>
            </section>
          )}

          {/* Requirements */}
          {job.requirements && (
            <section className="mb-6">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-3 pb-2 border-b-2 border-yellow-400 inline-block">
                Requirements
              </h2>
              <div className="text-slate-700 whitespace-pre-wrap leading-relaxed text-sm">
                {job.requirements}
              </div>
            </section>
          )}

          {/* Skills */}
          {job.skills && job.skills.length > 0 && (
            <section className="mb-6">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-3 pb-2 border-b-2 border-yellow-400 inline-block">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill: string, i: number) => (
                  <span key={i} className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full text-xs font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Nice to Have */}
          {job.niceToHave && (
            <section className="mb-6">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-3 pb-2 border-b-2 border-yellow-400 inline-block">
                Nice to Have
              </h2>
              <div className="text-slate-700 whitespace-pre-wrap leading-relaxed text-sm">
                {job.niceToHave}
              </div>
            </section>
          )}

          {/* Deadline */}
          {job.applicationDeadline && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6 flex items-center gap-2 text-sm text-amber-800">
              <Calendar className="w-4 h-4" />
              Apply before <strong>{new Date(job.applicationDeadline).toLocaleDateString()}</strong>
            </div>
          )}

                              {/* Apply section — hidden form by default */}
          <ApplySection jobId={job.id} />
        </div>
      </div>
    </div>
  )
}