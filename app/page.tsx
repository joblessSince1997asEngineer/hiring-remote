import { getJobs } from '@/lib/queries'
import JobsList from '@/components/JobsList'

// CRITICAL: This tells Vercel to skip database fetching during the build
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  // Fetch 70 real jobs from the live database
  const jobs = await getJobs()

  return <JobsList initialJobs={jobs} />
}