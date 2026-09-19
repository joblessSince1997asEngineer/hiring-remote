'use server'

import { getUserId } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function postJob(prevState: unknown, formData: FormData) {
  const userId = await getUserId()
  if (!userId) throw new Error('Unauthorized')

  const role = await prisma.roles.findUnique({ where: { user_id: userId } })
  if (!role || !['admin', 'super_admin'].includes(role.role)) {
    throw new Error('Only administrators can post new jobs.')
  }

  // Determine owner: selected client OR admin (for internal jobs)
  const ownerIdRaw = formData.get('ownerId') as string
  if (!ownerIdRaw) throw new Error('Please select who this job belongs to.')

  let recruiterId: string
  if (ownerIdRaw === '__internal__') {
    recruiterId = userId  // admin-owned (no client to invoice)
  } else {
    // Verify the selected client actually exists with recruiter role
    const client = await prisma.user.findUnique({ where: { id: ownerIdRaw } })
    if (!client) throw new Error('Selected client not found')
    recruiterId = client.id
  }

  // Parse skills
  const skillsRaw = formData.get('skills') as string
  const skills = skillsRaw
    ? skillsRaw.split(',').map(s => s.trim()).filter(Boolean)
    : []

  // Parse deadline
  const deadlineRaw = formData.get('applicationDeadline') as string
  const applicationDeadline = deadlineRaw ? new Date(deadlineRaw) : null

  await prisma.job.create({
    data: {
      title: formData.get('title') as string,
      company: formData.get('company') as string,
      location: formData.get('location') as string,
      type: formData.get('type') as string,
      category: (formData.get('category') as string) || null,
      salaryMin: parseInt(formData.get('salaryMin') as string) || 0,
      salaryMax: parseInt(formData.get('salaryMax') as string) || 0,
      description: formData.get('description') as string,
      recruiterId,

      seniority: (formData.get('seniority') as string) || null,
      remoteType: (formData.get('remoteType') as string) || null,
      currency: (formData.get('currency') as string) || 'USD',
      salaryPeriod: (formData.get('salaryPeriod') as string) || 'year',
      skills,
      responsibilities: (formData.get('responsibilities') as string) || null,
      requirements: (formData.get('requirements') as string) || null,
      niceToHave: (formData.get('niceToHave') as string) || null,
      applicationDeadline,
      status: 'published',
    },
  })

  revalidatePath('/')
  revalidatePath('/jobs')
  revalidatePath('/dashboard/jobs')
  redirect('/dashboard/jobs')
}