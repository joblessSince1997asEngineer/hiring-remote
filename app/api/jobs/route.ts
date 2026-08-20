import { getJobs } from '@/lib/queries'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const jobs = await getJobs()
    return NextResponse.json({ jobs })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ jobs: [] }, { status: 500 })
  }
}