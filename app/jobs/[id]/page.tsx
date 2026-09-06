import { getJob } from '@/lib/queries'
import { notFound } from 'next/navigation'
import LongApplicationForm from '@/components/LongApplicationForm'

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const job = await getJob(id)
  if (!job) return notFound()

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        
        {/* 1. TOP SECTION: Dark Navy Background + White Text */}
        <div className="bg-[#0f172a] p-6 rounded-xl mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{job.title}</h1>
          <p className="text-slate-300 mb-6">{job.company} • {job.location}</p>
          
          {/* 2. EXTRA BOX: Lighter Navy Background */}
          <div className="bg-[#1e293b] p-6 rounded-lg whitespace-pre-wrap leading-relaxed text-white">
            {job.description}
          </div>
        </div>
        
        <LongApplicationForm jobId={job.id} />
      </div>
    </div>
  )
}