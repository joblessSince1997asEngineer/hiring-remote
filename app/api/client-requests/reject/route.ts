import { getUserId } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const role = await prisma.roles.findUnique({ where: { user_id: userId } })
  if (!role || !['admin', 'super_admin'].includes(role.role)) {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }

  const { requestId } = await request.json()

  if (!requestId) {
    return NextResponse.json({ error: 'Missing requestId' }, { status: 400 })
  }

  try {
    const clientRequest = await prisma.client_Requests.findUnique({
      where: { id: requestId },
    })
    if (!clientRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 })
    }

    if (clientRequest.status === 'rejected') {
      return NextResponse.json({ error: 'Request already rejected' }, { status: 400 })
    }

    await prisma.client_Requests.update({
      where: { id: requestId },
      data: { status: 'rejected' },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Reject request error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}