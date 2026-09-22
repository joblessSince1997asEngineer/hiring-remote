'use client'
import { useState } from 'react'
import { Building2, User } from 'lucide-react'

export default function SignUpPage() {
  const [role, setRole] = useState('recruiter')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      })

      const data = await res.json()

      if (res.ok) {
        document.cookie = `userId=${data.user.id}; path=/`
        window.location.href = '/'
      } else {
        setError(data.error || 'Something went wrong')
      }
    } catch (err) {
      setError('Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      {/* LEFT SIDE - Form (Full width on Mobile, Half on Desktop) */}
      <div className="w-full md:w-1/2 flex flex-col justify-center p-6 md:px-24 bg-[#fcfcfc]">
        <div className="max-w-md mx-auto w-full">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-10 h-10 rounded-full bg-[#f59e0b] flex items-center justify-center text-white">
              <Building2 size={20} />
            </div>
            <span className="text-xl font-bold text-[#0f172a]">Remote Hiring</span>
          </div>

          <h1 className="text-3xl font-bold text-[#0f172a] mb-2">Create an account</h1>
          <p className="text-slate-500 mb-8">Choose your account type to get started.</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              type="button"
              onClick={() => setRole('recruiter')}
              className={`p-4 border-2 rounded-xl flex flex-col items-center justify-center gap-1 ${
                role === 'recruiter' ? 'border-[#f59e0b] bg-[#fffbeb] text-[#f59e0b]' : 'border-slate-200 text-slate-600'
              }`}
            >
              <Building2 size={24} />
              <span className="text-sm font-medium">I'm hiring</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('candidate')}
              className={`p-4 border-2 rounded-xl flex flex-col items-center justify-center gap-1 ${
                role === 'candidate' ? 'border-[#f59e0b] bg-[#fffbeb] text-[#f59e0b]' : 'border-slate-200 text-slate-600'
              }`}
            >
              <User size={24} />
              <span className="text-sm font-medium">I'm a candidate</span>
            </button>
          </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
            {role === 'recruiter' && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1 text-sm">Company Name</label>
                <input
                  type="text"
                  placeholder="Enter your company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full p-3 rounded-lg border border-slate-200 text-sm"
                />
              </div>
            )}
            <div>
              <label className="block font-semibold text-slate-700 mb-1 text-sm">
                {role === 'recruiter' ? 'Work Email' : 'Email'}
              </label>
              <input
                type="email"
                placeholder="Enter your work email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 rounded-lg border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1 text-sm">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 rounded-lg border border-slate-200 text-sm"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-black text-white py-4 rounded-full font-semibold"
            >
              {loading ? 'Creating...' : 'Create Account'}
            </button>

            <p className="text-center text-sm text-slate-500 mt-4">
              Already have an account? <a href="/login" className="text-[#f59e0b] font-medium">Log in</a>
            </p>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE - Dark Hero (Hidden on Mobile, Visible on Desktop) */}
      <div className="hidden md:flex w-1/2 bg-[#0f172a] text-white flex-col justify-center px-20">
        <h2 className="text-4xl font-bold mb-4">Build your dream team.</h2>
        <p className="text-slate-300 text-lg leading-relaxed">
          Access the top 1% of global talent with our comprehensive remote hiring platform.
        </p>
      </div>
    </div>
  )
}