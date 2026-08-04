import { prisma } from './prisma'

export async function getJobs(search?: string, location?: string, type?: string) {
  const whereClause: any = {}
  if (search) whereClause.OR = [{ title: { contains: search, mode: 'insensitive' } }, { company: { contains: search, mode: 'insensitive' } }]
  if (location) whereClause.location = { contains: location, mode: 'insensitive' }
  if (type) whereClause.type = type
  return prisma.job.findMany({ where: whereClause, orderBy: { postedAt: 'desc' } })
}

export async function getJob(id: string) { return prisma.job.findUnique({ where: { id } }) }
export async function getUserApplications(userId: string) {
  return prisma.application.findMany({ where: { userId }, include: { job: true } })
}