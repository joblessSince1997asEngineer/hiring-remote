import { getJobs } from '@/lib/queries'
import JobsList from '@/components/JobsList'

export default async function HomePage() {
  // Fetch 70 real jobs from the live database
  const jobs = await getJobs()

  return <JobsList initialJobs={jobs} />
}