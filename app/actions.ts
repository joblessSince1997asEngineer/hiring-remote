'use server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Added prevState as the FIRST argument
export async function postJob(prevState: unknown, formData: FormData) {
  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')?.value || 'guest'
  
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
  redirect('/')
}

// Added prevState as the SECOND argument
export async function applyToJob(jobId: string, prevState: unknown, formData: FormData) {
  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')?.value || 'guest'
  
  await prisma.application.create({
    data: {
      jobId,
      userId,
      coverLetter: formData.get('coverLetter') as string,
      cv_url: formData.get('cv_url') as string, // <--- ADD THIS LINE
    },
  })
  revalidatePath('/dashboard/applications')
  redirect('/dashboard/applications')
}