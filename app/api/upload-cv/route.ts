import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file') as File

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  if (file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 })
  }
  if (file.size > 5242880) {
    return NextResponse.json({ error: 'File too large. Max 5MB allowed.' }, { status: 400 })
  }

  // FIXED: Use the Service Role Key (this bypasses Storage RLS safely on the server)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const fileName = `${Date.now()}_${file.name}`
  const { data, error } = await supabase.storage
    .from('candidate_cvs')
    .upload(fileName, file, { contentType: 'application/pdf' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: signedData, error: signedError } = await supabase.storage
    .from('candidate_cvs')
    .createSignedUrl(data.path, 3600)

  if (signedError) return NextResponse.json({ error: signedError.message }, { status: 500 })

  return NextResponse.json({ url: signedData.signedUrl })
}