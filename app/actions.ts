'use server'

import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

// Function to post a new job
export async function postJob(formData: FormData) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  await prisma.job.create({
    data: {
      title: formData.get('title') as string,
      company: formData.get('company') as string,
      location: formData.get('location') as string,
      type: formData.get('type') as string,
      description: formData.get('description') as string,
      salaryMin: parseInt(formData.get('salaryMin') as string) || 0,
      salaryMax: parseInt(formData.get('salaryMax') as string) || 0,
      recruiterId: userId,
    },
  })
  revalidatePath('/')
  redirect('/')
}

// Function to apply to a job (NEW!)
export async function applyToJob(jobId: string, formData: FormData) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  // Prevent duplicate applications
  const existing = await prisma.application.findFirst({ where: { userId, jobId } })
  if (existing) throw new Error('Already applied')

  await prisma.application.create({
    data: { 
      userId, 
      jobId, 
      coverLetter: formData.get('coverLetter') as string 
    },
  })
  
  revalidatePath('/dashboard/applications')
  redirect('/dashboard/applications')
}