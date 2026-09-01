import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

export const prisma = globalForPrisma.prisma ?? (() => {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  })
  return new PrismaClient({ adapter })
})()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function getJobs(search?: string, location?: string, type?: string) {
  const whereClause: any = {}
  if (search) whereClause.OR = [{ title: { contains: search, mode: 'insensitive' } }, { company: { contains: search, mode: 'insensitive' } }]
  if (location) whereClause.location = { contains: location, mode: 'insensitive' }
  if (type) whereClause.type = type
  return prisma.job.findMany({ where: whereClause, orderBy: { postedAt: 'desc' } })
}

export async function getJob(id: string) {
  if (!id) return null
  try {
    return await prisma.job.findUnique({ where: { id } })
  } catch (e) {
    return null
  }
}

export async function getUserApplications(userId: string) {
  return prisma.application.findMany({ where: { userId }, include: { job: true } })
}

export async function getJobsByRecruiter(recruiterId: string) {
  return prisma.job.findMany({
    where: { recruiterId },
    orderBy: { postedAt: 'desc' },
    include: { applications: true },
  })
}

export async function getApplicationsForJob(jobId: string) {
  return prisma.application.findMany({
    where: { jobId },
    include: { job: true },
    orderBy: { appliedAt: 'desc' },
  })
}