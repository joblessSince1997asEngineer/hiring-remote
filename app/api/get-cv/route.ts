import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  const { url } = await request.json()
  if (!url) return NextResponse.json({ error: 'No URL provided' }, { status: 400 })

  try {
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split('/')
    const fileName = pathParts[pathParts.length - 1]

    if (!fileName) return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data, error } = await supabase.storage
      .from('candidate_cvs')
      .createSignedUrl(fileName, 3600)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ url: data.signedUrl })
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to parse URL' }, { status: 500 })
  }
}