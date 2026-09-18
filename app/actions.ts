'use server'

import { getUserId } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function postJob(prevState: unknown, formData: FormData) {
  const userId = await getUserId()

  if (!userId) throw new Error('Unauthorized')

  // *** THE FIX: ONLY ADMINS CAN POST JOBS ***
  const role = await prisma.roles.findUnique({ where: { user_id: userId } })
  if (!role || role.role !== 'admin') {
    throw new Error('Only administrators can post new jobs.')
  }

  await prisma.job.create({
    data: {
      title: formData.get('title') as string,
      company: formData.get('company') as string,
      location: formData.get('location') as string,
      type: formData.get('type') as string,
      salaryMin: parseInt(formData.get('salaryMin') as string) || 0,
      salaryMax: parseInt(formData.get('salaryMax') as string) || 0,
      description: formData.get('description') as string,
      recruiterId: userId,
    },
  })
  revalidatePath('/')
  redirect('/dashboard/jobs')
}