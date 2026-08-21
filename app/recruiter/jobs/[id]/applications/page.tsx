import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getApplicationsForJob, getJob } from '@/lib/queries'

export default async function JobApplicationsPage({ params }: { params: { id: string } }) {
  const { userId } = await auth()
  if (!userId) redirect('/')

  // 1. Ensure the job actually exists
  const job = await getJob(params.id)
  if (!job) return <div className="p-8 text-center text-red-500">Job not found.</div>

  // 2. Security: Ensure the logged-in recruiter actually owns this job!
  if (job.recruiterId !== userId) {
    return <div className="p-8 text-center text-red-500">You do not have permission to view these applications.</div>
  }

  const applications = await getApplicationsForJob(params.id)

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">{job.title}</h1>
        <p className="text-sm text-slate-500 mb-6">Applicants for this role</p>

        {applications.length === 0 ? (
          <p className="text-slate-500 text-center py-8">No one has applied to this job yet.</p>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="border border-slate-200 rounded-xl p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">Applicant ID: {app.userId}</h3>
                    <p className="text-sm text-slate-500">Applied on {new Date(app.appliedAt).toLocaleDateString()}</p>
                    {app.coverLetter && (
                      <div className="mt-2 p-3 bg-slate-50 rounded-lg text-sm text-slate-700 italic">
                        &ldquo;{app.coverLetter}&rdquo;
                      </div>
                    )}
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}