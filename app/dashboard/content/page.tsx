'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Loader2, Save, RotateCcw } from 'lucide-react'
import { CONTENT_DEFAULTS, CONTENT_LABELS, CONTENT_SECTIONS } from '@/lib/content-defaults'

export default function ContentEditorPage() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [original, setOriginal] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/cms/content')
      const data = await res.json()
      setValues(data.content || {})
      setOriginal(data.content || {})
    } catch {
      toast.error('Failed to load content')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleChange = (key: string, value: string) => {
    setValues(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    // Only send changed values
    const updates: Record<string, string> = {}
    for (const key of Object.keys(values)) {
      if (values[key] !== original[key]) {
        updates[key] = values[key]
      }
    }

    if (Object.keys(updates).length === 0) {
      toast.info('No changes to save')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/cms/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates }),
      })

      if (res.ok) {
        toast.success(`Saved ${Object.keys(updates).length} field(s)`)
        setOriginal(values)
      } else {
        const data = await res.json()
        toast.error(data.error || 'Save failed')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = (key: string) => {
    if (!confirm('Reset this field to its default value?')) return
    setValues(prev => ({ ...prev, [key]: CONTENT_DEFAULTS[key] || '' }))
  }

  const hasChanges = Object.keys(values).some(k => values[k] !== original[k])

  if (loading) {
    return (
      <div className="p-6 md:p-10 flex items-center gap-2 text-slate-500">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading content...
      </div>
    )
  }

  return (
    <div className="p-6 md:p-10">
      <div className="flex justify-between items-start gap-4 mb-8 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-[#0f172a] mb-1">Website Content</h1>
          <p className="text-slate-500">Edit text that appears on public pages. No code changes needed.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className="bg-black text-white px-5 py-2.5 rounded-full font-semibold text-sm flex items-center gap-2 hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {!hasChanges && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-6 text-sm text-slate-600">
          All content is up to date. Edit any field to save changes.
        </div>
      )}

      <div className="space-y-8">
        {Object.entries(CONTENT_SECTIONS).map(([sectionName, keys]) => (
          <div key={sectionName} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-[#0f172a] mb-4 pb-3 border-b border-slate-100">
              {sectionName}
            </h2>

            <div className="space-y-5">
              {keys.map((key) => {
                const meta = CONTENT_LABELS[key]
                if (!meta) return null

                const value = values[key] || ''
                const isChanged = value !== original[key]
                const isDefault = value === CONTENT_DEFAULTS[key]

                const inputClass = `w-full p-3 border rounded-lg text-sm outline-none transition-colors ${
                  isChanged
                    ? 'border-[#facc15] bg-amber-50'
                    : 'border-slate-300 focus:border-[#facc15]'
                }`

                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-sm font-semibold text-slate-700">
                        {meta.label}
                        {isChanged && (
                          <span className="ml-2 text-[10px] bg-[#facc15] text-slate-900 px-2 py-0.5 rounded-full font-bold">
                            UNSAVED
                          </span>
                        )}
                      </label>
                      {!isDefault && (
                        <button
                          onClick={() => handleReset(key)}
                          className="text-xs text-slate-500 hover:text-red-600 flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Reset to default
                        </button>
                      )}
                    </div>

                    {meta.type === 'textarea' ? (
                      <textarea
                        value={value}
                        onChange={(e) => handleChange(key, e.target.value)}
                        rows={key === 'about.story' ? 14 : 4}
                        className={inputClass + ' resize-none'}
                      />
                    ) : (
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleChange(key, e.target.value)}
                        className={inputClass}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {hasChanges && (
        <div className="sticky bottom-4 mt-8 bg-[#0f172a] text-white rounded-2xl p-4 flex items-center justify-between shadow-lg">
          <p className="text-sm">You have unsaved changes.</p>
          <div className="flex gap-2">
            <button
              onClick={() => { setValues(original); toast.info('Changes discarded') }}
              className="text-sm border border-slate-600 px-4 py-2 rounded-full hover:bg-slate-800"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="text-sm bg-[#facc15] text-slate-900 px-5 py-2 rounded-full font-semibold hover:bg-yellow-300 disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}