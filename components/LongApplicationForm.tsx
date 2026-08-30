'use client'
import { useActionState, useRef, useState } from 'react'
import { applyToJob } from '@/app/actions'

export default function LongApplicationForm({ jobId }: { jobId: string }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const boundAction = applyToJob.bind(null, jobId)
  const [state, action, pending] = useActionState(boundAction, null)

  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', city: '', university: '', degree: '', semester: '', linkedin: '', portfolio: '', 
    cvFile: null as File | null,
    cv_url: '',
    preferredDept: '', remoteWork: '',
    experience: '', proudProject: '', techSkills: '', languages: '', achievements: '',
    motivationJoin: '', motivationExcites: '', motivationValue: '', biggestStrength: '', biggestGrowth: '', careerGoals: '',
    scenarioDeadline: '', scenarioMissDeadline: '', scenarioDisagree: '', scenarioNewTask: '', scenarioSafety: '',
    declarationAccuracy: '', declarationPrivacy: '', declarationContact: '', declarationAvailability: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

    const [uploadingCV, setUploadingCV] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 1. Check file size (5MB max)
    if (file.size > 5242880) {
      alert('File too large. Max 5MB allowed.')
      return
    }

    setUploadingCV(true)
    const uploadData = new FormData()
    uploadData.append('file', file)

    try {
      // 2. Upload to Supabase Storage
      const res = await fetch('/api/upload-cv', {
        method: 'POST',
        body: uploadData,
      })
      const data = await res.json()
      
      if (res.ok) {
        // 3. Store the signed URL in formData
        setFormData(prev => ({ ...prev, cv_url: data.url }))
        alert('CV uploaded successfully!')
      } else {
        alert(data.error || 'Upload failed')
      }
    } catch (error) {
      alert('Network error during upload')
    } finally {
      setUploadingCV(false)
    }
  }

  return (
    <form action={action} className="mt-10 pt-8 border-t border-slate-200">
      <input type="hidden" name="cv_url" value={formData.cv_url} />
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
          <div><label className="block font-medium mb-1 text-sm text-slate-700">Semester or Graduation Year</label><input type="text" name="semester" value={formData.semester} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-yellow-400 text-sm" /></div>
          <div><label className="block font-medium mb-1 text-sm text-slate-700">LinkedIn Profile</label><input type="text" name="linkedin" value={formData.linkedin} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-yellow-400 text-sm" /></div>
          <div className="md:col-span-2"><label className="block font-medium mb-1 text-sm text-slate-700">Portfolio, GitHub, Writing, Design, or Project Link</label><input type="text" name="portfolio" value={formData.portfolio} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-yellow-400 text-sm" /></div>
          
          <div className="md:col-span-2">
            <label className="block font-medium mb-1 text-sm text-slate-700">CV / Resume Upload *</label>
            <div className="flex gap-3 items-center">
              <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition">📄 Upload CV</button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.doc,.docx" className="hidden" />
              <span className="text-sm text-slate-500">{formData.cvFile ? `✅ ${formData.cvFile.name}` : 'No file chosen'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: JOB PREFERENCES */}
      <div className="mb-8 bg-slate-50 p-6 rounded-xl border border-slate-200">
        <div className="flex items-center gap-3 mb-4"><h3 className="text-lg font-bold text-slate-900">Job Preferences</h3></div>
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

      {/* SECTION 4: MOTIVATION */}
      <div className="mb-8 bg-slate-50 p-6 rounded-xl border border-slate-200">
        <div className="flex items-center gap-3 mb-4"><h3 className="text-lg font-bold text-slate-900">Motivation & Growth</h3></div>
        <div className="space-y-4">
          <div><label className="block font-medium mb-1 text-sm text-slate-700">Why do you want to join our team?</label><textarea name="motivationJoin" rows={3} value={formData.motivationJoin} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg outline-none text-sm" /></div>
          <div><label className="block font-medium mb-1 text-sm text-slate-700">What excites you about our preferred department?</label><textarea name="motivationExcites" rows={3} value={formData.motivationExcites} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg outline-none text-sm" /></div>
          <div><label className="block font-medium mb-1 text-sm text-slate-700">What value can you bring to your preferred department?</label><textarea name="motivationValue" rows={3} value={formData.motivationValue} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg outline-none text-sm" /></div>
          <div><label className="block font-medium mb-1 text-sm text-slate-700">Biggest strength.</label><textarea name="biggestStrength" rows={2} value={formData.biggestStrength} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg outline-none text-sm" /></div>
          <div><label className="block font-medium mb-1 text-sm text-slate-700">Biggest development area.</label><textarea name="biggestGrowth" rows={2} value={formData.biggestGrowth} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg outline-none text-sm" /></div>
          <div><label className="block font-medium mb-1 text-sm text-slate-700">What are your career goals over the next two years?</label><textarea name="careerGoals" rows={3} value={formData.careerGoals} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg outline-none text-sm" /></div>
        </div>
      </div>

      {/* SECTION 5: SCENARIO QUESTIONS */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4 border-b-2 border-yellow-400 pb-2 inline-flex"><h3 className="text-lg font-bold text-slate-900">Scenario Questions</h3></div>
        <p className="text-slate-500 text-sm mb-4">Answer freely. We are evaluating clarity, initiative, communication, and problem-solving.</p>
        <div className="space-y-4">
          <div><label className="block font-medium mb-1 text-sm text-slate-700">You receive a task with an unclear deadline. What do you do?</label><textarea name="scenarioDeadline" rows={3} value={formData.scenarioDeadline} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg outline-none text-sm" /></div>
          <div><label className="block font-medium mb-1 text-sm text-slate-700">You realize you may miss a deadline. What do you communicate, and when?</label><textarea name="scenarioMissDeadline" rows={3} value={formData.scenarioMissDeadline} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg outline-none text-sm" /></div>
          <div><label className="block font-medium mb-1 text-sm text-slate-700">A teammate disagrees with your idea. How do you handle it?</label><textarea name="scenarioDisagree" rows={3} value={formData.scenarioDisagree} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg outline-none text-sm" /></div>
          <div><label className="block font-medium mb-1 text-sm text-slate-700">You are asked to do something you have never done. What is your first step?</label><textarea name="scenarioNewTask" rows={3} value={formData.scenarioNewTask} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg outline-none text-sm" /></div>
          <div><label className="block font-medium mb-1 text-sm text-slate-700">You notice a user-safety concern in a product or campaign. What would you do?</label><textarea name="scenarioSafety" rows={3} value={formData.scenarioSafety} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg outline-none text-sm" /></div>
        </div>
      </div>

      {/* SECTION 6: DECLARATIONS & SUBMIT */}
      <div className="border-t border-slate-200 pt-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Declarations</h3>
        <div className="space-y-3 mb-6">
          <div><label className="block font-medium mb-1 text-sm text-slate-700">Are the details in this application accurate?</label><div className="flex gap-4">{['Yes', 'No'].map(opt => <label key={opt} className="flex items-center gap-2 text-sm"><input type="radio" name="declarationAccuracy" value={opt} checked={formData.declarationAccuracy === opt} onChange={handleChange} /> {opt}</label>)}</div></div>
          <div><label className="block font-medium mb-1 text-sm text-slate-700">Do you agree to keep our confidential information private if selected?</label><div className="flex gap-4">{['Yes', 'No'].map(opt => <label key={opt} className="flex items-center gap-2 text-sm"><input type="radio" name="declarationPrivacy" value={opt} checked={formData.declarationPrivacy === opt} onChange={handleChange} /> {opt}</label>)}</div></div>
          <div><label className="block font-medium mb-1 text-sm text-slate-700">May companies contact you about this application?</label><div className="flex gap-4">{['Yes', 'No'].map(opt => <label key={opt} className="flex items-center gap-2 text-sm"><input type="radio" name="declarationContact" value={opt} checked={formData.declarationContact === opt} onChange={handleChange} /> {opt}</label>)}</div></div>
          <div><label className="block font-medium mb-1 text-sm text-slate-700">Can you commit to the availability you stated?</label><div className="flex gap-4 flex-wrap">{['Yes', 'No', 'I need to discuss it'].map(opt => <label key={opt} className="flex items-center gap-2 text-sm"><input type="radio" name="declarationAvailability" value={opt} checked={formData.declarationAvailability === opt} onChange={handleChange} /> {opt}</label>)}</div></div>
        </div>
        <button type="submit" disabled={pending} className="w-full bg-slate-900 text-white py-4 rounded-full font-bold hover:bg-slate-800 transition">
          {pending ? 'Submitting...' : 'Submit Application'}
        </button>
      </div>
    </form>
  )
}