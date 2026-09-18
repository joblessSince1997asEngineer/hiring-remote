'use client'

import { toast } from 'sonner'
import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LongApplicationForm({ jobId }: { jobId: string }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const [pending, setPending] = useState(false)

  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', city: '', university: '', degree: '', semester: '', linkedin: '', portfolio: '',
    cvFile: null as File | null,
    cv_url: '',
    cvFileName: '',
    preferredDept: '', remoteWork: '',
    experience: '', proudProject: '', techSkills: '', languages: '', achievements: '',
    // Hidden — kept for API compatibility, not rendered
    motivationJoin: '', motivationExcites: '', motivationValue: '', biggestStrength: '', biggestGrowth: '', careerGoals: '',
    scenarioDeadline: '', scenarioDisagree: '',
    scenarioMissDeadline: '', scenarioNewTask: '', scenarioSafety: '',
    declarationConfirm: ''
  })

  // Prefill basic info from the candidate's profile + account
  useEffect(() => {
    async function prefill() {
      try {
        const [profileRes, accountRes] = await Promise.all([
          fetch('/api/candidate/profile'),
          fetch('/api/account'),
        ])
        const profileData = profileRes.ok ? await profileRes.json() : null
        const accountData = accountRes.ok ? await accountRes.json() : null
        const p = profileData?.profile

        setFormData(prev => ({
          ...prev,
          fullName:   prev.fullName   || p?.fullName     || '',
          phone:      prev.phone      || p?.phone        || '',
          city:       prev.city       || p?.city         || '',
          linkedin:   prev.linkedin   || p?.linkedinUrl  || '',
          portfolio:  prev.portfolio  || p?.portfolioUrl || '',
          cv_url:     prev.cv_url     || p?.cvUrl        || '',
          cvFileName: prev.cvFileName || (p?.cvUrl ? 'Using CV from your profile' : ''),
          email:      prev.email      || accountData?.email || '',
        }))
      } catch {
        // silent — user can still fill manually
      }
    }
    prefill()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5242880) {
      toast.error('File too large. Max 5MB allowed.')
      return
    }

    setFormData(prev => ({ ...prev, cvFileName: file.name }))

    const uploadData = new FormData()
    uploadData.append('file', file)

    try {
      const res = await fetch('/api/upload-cv', { method: 'POST', body: uploadData })
      const data = await res.json()
      if (res.ok) {
        setFormData(prev => ({ ...prev, cv_url: data.url }))
        toast.success('CV uploaded successfully!')
      } else {
        toast.error(data.error || 'Upload failed')
      }
    } catch (error) {
      toast.error('Network error during upload')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.declarationConfirm !== 'Yes') {
      toast.error('Please confirm the declaration before submitting.')
      return
    }

    setPending(true)

    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, formData }),
      })

      if (res.ok) {
        router.push('/dashboard/applications')
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to submit application')
      }
    } catch (err) {
      toast.error('Network error')
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 pt-8 border-t border-slate-200">
      <h2 className="text-xl font-bold text-slate-900 mb-6">Full Application Form</h2>

      {/* SECTION 1: BASIC INFO */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4 border-b-2 border-yellow-400 pb-2 inline-flex">
          <h3 className="text-lg font-bold text-slate-900">Basic Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block font-medium mb-1 text-sm text-slate-700">Full Name *</label><input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-yellow-400 text-sm" /></div>
          <div><label className="block font-medium mb-1 text-sm text-slate-700">Email Address *</label><input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-yellow-400 text-sm" /></div>
          <div><label className="block font-medium mb-1 text-sm text-slate-700">Phone Number *</label><input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-yellow-400 text-sm" /></div>
          <div><label className="block font-medium mb-1 text-sm text-slate-700">City</label><input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-yellow-400 text-sm" /></div>
          <div><label className="block font-medium mb-1 text-sm text-slate-700">University or Institute *</label><input type="text" name="university" required value={formData.university} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-yellow-400 text-sm" /></div>
          <div><label className="block font-medium mb-1 text-sm text-slate-700">Degree or Program *</label><input type="text" name="degree" required value={formData.degree} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-yellow-400 text-sm" /></div>
          <div><label className="block font-medium mb-1 text-sm text-slate-700">Graduation Year</label><input type="text" name="semester" value={formData.semester} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-yellow-400 text-sm" /></div>
          <div><label className="block font-medium mb-1 text-sm text-slate-700">LinkedIn Profile</label><input type="text" name="linkedin" value={formData.linkedin} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-yellow-400 text-sm" /></div>
          <div className="md:col-span-2"><label className="block font-medium mb-1 text-sm text-slate-700">Portfolio, GitHub, Writing, Design, or Project Link</label><input type="text" name="portfolio" value={formData.portfolio} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-yellow-400 text-sm" /></div>

          <div className="md:col-span-2">
            <label className="block font-medium mb-1 text-sm text-slate-700">CV / Resume Upload *</label>
            <div className="flex gap-3 items-center">
              <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition">📄 Upload CV</button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.doc,.docx" className="hidden" />
              <span className="text-sm text-slate-500">
                {formData.cvFileName ? `✅ ${formData.cvFileName}` : 'No file chosen'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: JOB PREFERENCES */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4 border-b-2 border-yellow-400 pb-2 inline-flex"><h3 className="text-lg font-bold text-slate-900">Job Preferences</h3></div>
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-1 text-sm text-slate-700">Preferred Department *</label>
            <select name="preferredDept" required value={formData.preferredDept} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-yellow-400 text-sm bg-white">
              <option value="">Select a department</option>
              {['Product', 'UI/UX Design', 'Android Development', 'Backend Development', 'Frontend Development', 'Quality Assurance', 'Marketing', 'Graphic Design', 'Content Writing', 'Business Development', 'Human Resources', 'Finance', 'Operations', 'Research & Development', 'Community Management', 'Information Technology', 'Engineering', 'Fintech'].map(dept => <option key={dept}>{dept}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1 text-sm text-slate-700">Can you work remotely using spread communication channels? *</label>
            <div className="flex gap-6 pt-1">
              {['Yes', 'No', 'Yes, with limitations'].map(opt => <label key={opt} className="flex items-center gap-2 text-sm"><input type="radio" name="remoteWork" value={opt} checked={formData.remoteWork === opt} onChange={handleChange} className="w-4 h-4" /> {opt}</label>)}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: BACKGROUND */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4 border-b-2 border-yellow-400 pb-2 inline-flex"><h3 className="text-lg font-bold text-slate-900">Background & Experience</h3></div>
        <div className="space-y-4">
          <div><label className="block font-medium mb-1 text-sm text-slate-700">Experience, coursework, volunteering, freelance work, or community involvement.</label><textarea name="experience" rows={3} value={formData.experience} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg outline-none text-sm" /></div>
          <div><label className="block font-medium mb-1 text-sm text-slate-700">Describe one project you are proud of.</label><textarea name="proudProject" rows={3} value={formData.proudProject} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg outline-none text-sm" /></div>
          <div><label className="block font-medium mb-1 text-sm text-slate-700">Software, technical, or creative skills.</label><textarea name="techSkills" rows={2} value={formData.techSkills} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg outline-none text-sm" /></div>
          <div><label className="block font-medium mb-1 text-sm text-slate-700">Languages you can work in.</label><input type="text" name="languages" value={formData.languages} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg outline-none text-sm" /></div>
          <div><label className="block font-medium mb-1 text-sm text-slate-700">Achievements, certifications, or communities.</label><textarea name="achievements" rows={2} value={formData.achievements} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg outline-none text-sm" /></div>
        </div>
      </div>

      {/* SECTION 4: SCENARIO QUESTIONS (trimmed to 2) */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4 border-b-2 border-yellow-400 pb-2 inline-flex"><h3 className="text-lg font-bold text-slate-900">Scenario Questions</h3></div>
        <p className="text-slate-500 text-sm mb-4">Answer freely. We are evaluating clarity, initiative, communication, and problem-solving.</p>
        <div className="space-y-4">
          <div><label className="block font-medium mb-1 text-sm text-slate-700">You receive a task with an unclear deadline. What do you do?</label><textarea name="scenarioDeadline" rows={3} value={formData.scenarioDeadline} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg outline-none text-sm" /></div>
          <div><label className="block font-medium mb-1 text-sm text-slate-700">A teammate disagrees with your idea. How do you handle it?</label><textarea name="scenarioDisagree" rows={3} value={formData.scenarioDisagree} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg outline-none text-sm" /></div>
        </div>
      </div>

      {/* SECTION 5: DECLARATION + SUBMIT */}
      <div className="border-t border-slate-200 pt-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Declaration</h3>
        <label className="flex items-start gap-3 text-sm mb-6 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.declarationConfirm === 'Yes'}
            onChange={(e) => setFormData(prev => ({ ...prev, declarationConfirm: e.target.checked ? 'Yes' : '' }))}
            className="w-4 h-4 mt-1"
            required
          />
          <span className="text-slate-700 leading-relaxed">
            I confirm that the information above is accurate and consent to Remote Hirring sharing my application with potential employers.
          </span>
        </label>
        <button type="submit" disabled={pending} className="w-full bg-slate-900 text-white py-4 rounded-full font-bold hover:bg-slate-800 transition">
          {pending ? 'Submitting...' : 'Submit Application'}
        </button>
      </div>
    </form>
  )
}