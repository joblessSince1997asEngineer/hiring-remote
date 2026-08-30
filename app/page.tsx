import { getJobs } from '@/lib/queries'
import JobsList from '@/components/JobsList'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  // This fetches the 70 real jobs from your Supabase database
  const jobs = await getJobs()

  return <JobsList initialJobs={jobs} />
}