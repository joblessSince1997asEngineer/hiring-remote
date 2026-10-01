'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Plus, Trash2, ArrowUp, ArrowDown, Save, Loader2, Info, AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'

type Question = {
  id?: string
  question: string
  timeLimit: number
}

export default function QuestionEditor({
  jobId,
  initialQuestions,
}: {
  jobId: string
  initialQuestions: Question[]
}) {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>(
    initialQuestions.length ? initialQuestions : [{ question: '', timeLimit: 60 }]
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function add() {
    if (questions.length >= 10) {
      toast.error('Maximum 10 questions')
      return
    }
    setQuestions([...questions, { question: '', timeLimit: 60 }])
  }

  function update(index: number, patch: Partial<Question>) {
    setQuestions(prev =>
      prev.map((q, i) => (i === index ? { ...q, ...patch } : q))
    )
  }

  function remove(index: number) {
    setQuestions(prev => prev.filter((_, i) => i !== index))
  }

  function move(index: number, dir: -1 | 1) {
    const next = index + dir
    if (next < 0 || next >= questions.length) return
    const copy = [...questions]
    ;[copy[index], copy[next]] = [copy[next], copy[index]]
    setQuestions(copy)
  }

  async function save() {
    setError('')
    const cleaned = questions
      .map(q => ({ ...q, question: q.question.trim() }))
      .filter(q => q.question)

    if (cleaned.length === 0) {
      setError('Add at least one question')
      return
    }
    for (const q of cleaned) {
      if (q.timeLimit < 15 || q.timeLimit > 300) {
        setError('Time limit must be between 15 and 300 seconds')
        return
      }
    }

    setSaving(true)
    try {
      const res = await fetch('/api/screening/questions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, questions: cleaned }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save')
      toast.success('Questions saved')
      setQuestions(data.questions)
      router.refresh()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-sm text-red-800">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900">
          <p className="font-medium mb-1">Recommended: 3–5 questions</p>
          <p className="text-xs text-blue-800">
            Candidates will record one video per question. Keep it focused —
            5 questions × 60s is a good length. Videos are only visible to admins.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((q, i) => (
          <div
            key={i}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase">
                Question {i + 1}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === questions.length - 1}
                  className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => remove(i)}
                  disabled={questions.length === 1}
                  className="p-1.5 text-red-500 hover:text-red-700 disabled:opacity-30 disabled:cursor-not-allowed ml-2"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <textarea
              value={q.question}
              onChange={e => update(i, { question: e.target.value })}
              placeholder="e.g. Walk us through a technical challenge you recently solved."
              rows={3}
              className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#facc15] resize-none mb-3"
            />

            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-slate-500 uppercase">
                Time limit
              </label>
              <input
                type="number"
                min={15}
                max={300}
                value={q.timeLimit}
                onChange={e => update(i, { timeLimit: Number(e.target.value) })}
                className="w-24 p-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#facc15]"
              />
              <span className="text-xs text-slate-400">seconds</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-2">
        <button
          onClick={add}
          disabled={questions.length >= 10}
          className="inline-flex items-center gap-2 border border-slate-300 text-slate-700 px-4 py-2.5 rounded-full text-sm font-medium hover:bg-slate-50 transition disabled:opacity-50"
        >
          <Plus className="w-4 h-4" /> Add Question
        </button>

        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-[#0f172a] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-800 transition disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving…' : 'Save Questions'}
        </button>
      </div>
    </div>
  )
}