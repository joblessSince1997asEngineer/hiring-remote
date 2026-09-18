import { getUserId } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const userId = await getUserId()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Verify admin
    const roleRow = await prisma.roles.findUnique({ where: { user_id: userId } })
    if (!roleRow || !['admin', 'super_admin'].includes(roleRow.role)) {
      return NextResponse.json({ error: 'Only admin can reject hires' }, { status: 403 })
    }

    const { applicationId, reason } = await request.json()

    if (!applicationId) {
      return NextResponse.json({ error: 'Missing applicationId' }, { status: 400 })
    }

    if (!reason || reason.length < 10) {
      return NextResponse.json({ error: 'Reason must be at least 10 characters' }, { status: 400 })
    }

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
    })
    if (!application) return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    if (application.status !== 'hire_pending') {
      return NextResponse.json({ error: 'Application is not pending hire approval' }, { status: 400 })
    }

    // Return to shortlisted + store reason in feedback
    await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: 'shortlisted',
        feedback: reason,
      },
    })

    // Notify the client
    await prisma.notification.create({
      data: {
        userId: application.userId,
        type: 'hire_rejected',
        title: 'Hire request not approved',
        message: `Admin did not approve the hire. Reason: ${reason}`,
        link: '/account',
      },
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Hire reject error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}