import { getJobs } from '@/lib/queries'
import JobsList from '@/components/JobsList'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Browse Remote Jobs',
  description:
    'Explore curated remote roles from vetted companies worldwide. Full-time, contract, and part-time positions updated daily.',
}

export const dynamic = 'force-dynamic'

export default async function JobsPage() {
  const jobs = await getJobs()
  return <JobsList initialJobs={jobs} />
}