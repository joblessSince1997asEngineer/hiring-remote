'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Upload, CheckCircle2, Loader2, FileText } from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    fullName: '',
    primarySkill: '',
    yearsExp: '',
    expectedSalary: '',
    timezone: '',
    phone: '',
    city: '',
    country: '',
    linkedinUrl: '',
    portfolioUrl: '',
    bio: '',
    cvUrl: '',
  })

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/candidate/profile')
        const data = await res.json()
        if (res.ok && data.profile) {
          setForm({
            fullName: data.profile.fullName || '',
            primarySkill: data.profile.primarySkill || '',
            yearsExp: data.profile.yearsExp?.toString() || '',
            expectedSalary: data.profile.expectedSalary?.toString() || '',
            timezone: data.profile.timezone || '',
            phone: data.profile.phone || '',
            city: data.profile.city || '',
            country: data.profile.country || '',
            linkedinUrl: data.profile.linkedinUrl || '',
            portfolioUrl: data.profile.portfolioUrl || '',
            bio: data.profile.bio || '',
            cvUrl: data.profile.cvUrl || '',
          })
        } else if (!res.ok) {
          router.push('/login')
        }
      } catch (err) {
        console.error('Load error:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [router])

  const handleChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError('File too large. Max 5MB.')
      return
    }

    setUploading(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload-cv', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')

      // Accept whichever key the API returns
      const url = data.url || data.cvUrl || data.publicUrl || data.signedUrl
      if (!url) throw new Error('Upload succeeded but no URL returned')
      setForm(prev => ({ ...prev, cvUrl: url }))
      setSaved(false)
    } catch (err: any) {
      setError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const res = await fetch('/api/candidate/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Save failed')
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    )
  }

  const inputClass =
    'w-full p-3 rounded-lg border border-slate-200 text-sm outline-none focus:border-[#facc15] bg-white'
  const labelClass = 'block text-sm font-semibold text-slate-700 mb-1'

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 md:py-12 px-4">
      <div className="max-w-3xl mx-auto">

        <Link
          href="/account"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Account
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">

          <h1 className="text-2xl font-bold text-[#0f172a] mb-1">My Profile</h1>
          <p className="text-sm text-slate-500 mb-8">
            This is what clients and admin see when reviewing your applications.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Section: Basic Info */}
            <div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4">Basic Info</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    placeholder="John Doe"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="+1 555 123 4567"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>City</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder="Karachi"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Country</label>
                  <input
                    type="text"
                    value={form.country}
                    onChange={(e) => handleChange('country', e.target.value)}
                    placeholder="Pakistan"
                    className={inputClass}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Timezone</label>
                  <input
                    type="text"
                    value={form.timezone}
                    onChange={(e) => handleChange('timezone', e.target.value)}
                    placeholder="e.g., PKT (UTC+5), EST, GMT"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* Section: Professional */}
            <div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4">Professional</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={labelClass}>Primary Skill</label>
                  <input
                    type="text"
                    value={form.primarySkill}
                    onChange={(e) => handleChange('primarySkill', e.target.value)}
                    placeholder="e.g., Data Scientist, React Developer"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Years of Experience</label>
                  <input
                    type="number"
                    min="0"
                    value={form.yearsExp}
                    onChange={(e) => handleChange('yearsExp', e.target.value)}
                    placeholder="5"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Expected Salary (annual, USD)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.expectedSalary}
                    onChange={(e) => handleChange('expectedSalary', e.target.value)}
                    placeholder="60000"
                    className={inputClass}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Bio</label>
                  <textarea
                    rows={4}
                    value={form.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    placeholder="A short summary about you, your experience, and what you're looking for."
                    className={inputClass + ' resize-none'}
                  />
                </div>
              </div>
            </div>

            {/* Section: Links */}
            <div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4">Links</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>LinkedIn URL</label>
                  <input
                    type="url"
                    value={form.linkedinUrl}
                    onChange={(e) => handleChange('linkedinUrl', e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Portfolio URL</label>
                  <input
                    type="url"
                    value={form.portfolioUrl}
                    onChange={(e) => handleChange('portfolioUrl', e.target.value)}
                    placeholder="https://yourportfolio.com"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* Section: CV Upload */}
            <div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4">CV / Resume</h2>

              {form.cvUrl ? (
                <div className="flex flex-col md:flex-row md:items-center gap-3 p-4 border border-slate-200 rounded-xl bg-slate-50">
                  <FileText className="w-6 h-6 text-blue-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800">CV uploaded</p>
                    <p className="text-xs text-slate-500 truncate">{form.cvUrl}</p>
                  </div>
                  <label className="cursor-pointer bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 whitespace-nowrap">
                    Replace
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={handleCvUpload}
                      disabled={uploading}
                    />
                  </label>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-2 p-8 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-[#facc15] hover:bg-amber-50/30 transition-colors">
                  {uploading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                  ) : (
                    <Upload className="w-6 h-6 text-slate-400" />
                  )}
                  <p className="text-sm font-medium text-slate-700">
                    {uploading ? 'Uploading…' : 'Click to upload CV'}
                  </p>
                  <p className="text-xs text-slate-400">PDF only, max 5MB</p>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleCvUpload}
                    disabled={uploading}
                  />
                </label>
              )}

              {uploading && <p className="mt-2 text-xs text-slate-500">Uploading, please wait…</p>}
            </div>

            {/* Error / Success */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Save Button */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-400">
                Changes are visible to clients and admins instantly.
              </p>
              <button
                type="submit"
                disabled={saving}
                className="bg-[#0f172a] text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-slate-800 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saved && <CheckCircle2 className="w-4 h-4" />}
                {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Profile'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}