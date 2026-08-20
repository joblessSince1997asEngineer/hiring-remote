import { getJobs } from '@/lib/queries'
import JobsList from '@/components/JobsList'

// This tells Next.js: "Do not generate this page at build time. Fetch fresh data each time a user visits."
export const dynamic = 'force-dynamic'

export default async function JobsPage() {
  const jobs = await getJobs()
  return <JobsList initialJobs={jobs} />
}