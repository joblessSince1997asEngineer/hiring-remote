import { getJobs } from '@/lib/queries'
import { JobCard } from '@/components/JobCard'

export default async function JobsPage() {
  // Fetch ALL jobs from the database
  const jobs = await getJobs()

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">All Remote Jobs</h1>
        
        <div className="space-y-4">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))
          ) : (
            <div className="bg-white p-12 rounded-2xl text-center shadow-sm border border-slate-100">
              <p className="text-slate-600 text-lg">No jobs found in the database yet. Go to the dashboard to post one!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}