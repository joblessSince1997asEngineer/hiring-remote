import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getJobsByRecruiter } from '@/lib/queries'
import Link from 'next/link'

export default async function RecruiterJobsPage() {
  const { userId } = await auth()
  if (!userId) redirect('/')

  const jobs = await getJobsByRecruiter(userId)

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">My Job Postings</h1>
          <Link href="/dashboard/post">
            <button className="bg-black text-white px-6 py-2 rounded-full font-medium">+ Post New Job</button>
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl text-center border border-slate-100">
            <p className="text-slate-500">You haven't posted any jobs yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <Link key={job.id} href={`/recruiter/jobs/${job.id}/applications`}>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg">{job.title}</h3>
                    <p className="text-sm text-slate-500">{job.location}</p>
                  </div>
                  <span className="bg-slate-100 px-3 py-1 rounded-full text-sm text-slate-700">
                    {job.applications.length} Applicant{job.applications.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}