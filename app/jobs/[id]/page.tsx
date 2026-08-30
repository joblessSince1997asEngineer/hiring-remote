import { getJob } from '@/lib/queries'
import { notFound } from 'next/navigation'
import LongApplicationForm from '@/components/LongApplicationForm'

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Next.js 15+ requires us to 'await' the params
  const { id } = await params

  const job = await getJob(id)
  if (!job) return notFound()

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{job.title}</h1>
        <p className="text-slate-500 mb-6">{job.company} • {job.location}</p>
        <div className="bg-slate-50 p-6 rounded-xl mb-8 whitespace-pre-wrap leading-relaxed">
          {job.description}
        </div>
        <LongApplicationForm jobId={job.id} />
      </div>
    </div>
  )
}