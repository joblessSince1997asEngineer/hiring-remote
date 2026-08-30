'use server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const hash = (str: string) => btoa(str)

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const role = formData.get('role') as string || 'candidate'
  
  if (!email || !password) throw new Error('Missing fields')
  
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw new Error('Email already exists')
  
  const user = await prisma.user.create({ data: { email, password: hash(password), role } })
  cookies().set('userId', user.id)
  redirect('/')
}

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || user.password !== hash(password)) throw new Error('Invalid credentials')
  
  cookies().set('userId', user.id)
  redirect('/')
}