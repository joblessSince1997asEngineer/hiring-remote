import JobsList from '@/components/JobsList'

export const dynamic = 'force-dynamic'

export default async function JobsPage() {
  // Same dynamic import – Prisma will never load during the build!
  const { getJobs } = await import('@/lib/queries')
  const jobs = await getJobs()

  return <JobsList initialJobs={jobs} />
}