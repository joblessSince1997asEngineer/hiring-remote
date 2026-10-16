'use client'

import { useRef, useState } from 'react'
import { Upload, X, Loader2, ImageIcon } from 'lucide-react'

export default function ImageUploadField({
  value,
  onChange,
  label,
}: {
  value: string
  onChange: (url: string) => void
  label?: string
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<string | null>(null)

  async function handleFile(file: File) {
    setError('')
    setUploading(true)

    // Local preview immediately
    const localUrl = URL.createObjectURL(file)
    setPreview(localUrl)

    try {
      const fd = new FormData()
      fd.append('file', file)

      const res = await fetch('/api/cms/upload-image', {
        method: 'POST',
        body: fd,
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Upload failed')

      onChange(data.url)
      setPreview(null)
    } catch (e: any) {
      setError(e.message)
      setPreview(null)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  function handleRemove() {
    onChange('')
    setPreview(null)
    setError('')
  }

  const displayUrl = preview || value

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={handleInputChange}
        className="hidden"
      />

      {displayUrl ? (
        <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="w-32 h-32 rounded-lg overflow-hidden bg-white border border-slate-200 shrink-0 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayUrl}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={e => {
                ;(e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-500 truncate mb-3">
              {value || 'Uploading…'}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-1.5 bg-[#0f172a] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-slate-800 transition disabled:opacity-50"
              >
                {uploading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                {uploading ? 'Uploading…' : 'Replace'}
              </button>
              <button
                type="button"
                onClick={handleRemove}
                disabled={uploading}
                className="inline-flex items-center gap-1.5 border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-slate-50 transition disabled:opacity-50"
              >
                <X className="w-3.5 h-3.5" /> Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full flex flex-col items-center justify-center gap-2 p-8 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-[#facc15] hover:bg-amber-50/30 transition disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <ImageIcon className="w-6 h-6" />
          )}
          <span className="text-sm font-medium">
            {uploading ? 'Uploading…' : 'Click to upload image'}
          </span>
          <span className="text-xs text-slate-400">PNG, JPG, WEBP, or GIF · max 5 MB</span>
        </button>
      )}

      {error && (
        <p className="mt-2 text-xs text-red-600">{error}</p>
      )}
    </div>
  )
}