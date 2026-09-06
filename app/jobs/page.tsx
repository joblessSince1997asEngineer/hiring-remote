import { getJobs } from '@/lib/queries'
import JobsList from '@/components/JobsList'

export const dynamic = 'force-dynamic'

export default async function JobsPage() {
  const jobs = await getJobs()
  return <JobsList initialJobs={jobs} />
}