'use client'
import { useState } from 'react'
import { Building2, User, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

// Free email providers that should be blocked for recruiters
const FREE_EMAIL_DOMAINS = [
  'gmail.com', 'yahoo.com', 'yahoo.co.uk', 'outlook.com', 'hotmail.com',
  'live.com', 'msn.com', 'aol.com', 'icloud.com', 'me.com', 'mac.com',
  'protonmail.com', 'proton.me', 'mail.com', 'gmx.com', 'gmx.net',
  'yandex.com', 'yandex.ru', 'qq.com', '163.com', '126.com', 'rediffmail.com',
  'zoho.com', 'tutanota.com', 'fastmail.com',
]

function isFreeEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase()
  if (!domain) return false
  return FREE_EMAIL_DOMAINS.includes(domain)
}

export default function SignUpPage() {
  const [role, setRole] = useState('recruiter')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate: recruiter must use organizational email
    if (role === 'recruiter' && isFreeEmail(email)) {
      setError('Please use your work email (e.g., you@company.com). Personal emails like Gmail are not accepted for company accounts.')
      return
    }

    // Validate: passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    // Validate: min length
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      })

      const data = await res.json()

      if (res.ok) {
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
      {/* LEFT SIDE */}
      <div className="w-full md:w-1/2 flex flex-col justify-center p-6 md:px-24 bg-[#fcfcfc]">
        <div className="max-w-md mx-auto w-full">

          {/* Logo */}
          <div className="flex items-center gap-2 mb-10">
            <div className="w-10 h-10 rounded-full bg-[#facc15] flex items-center justify-center text-slate-900">
              <Building2 size={20} />
            </div>
            <span className="text-xl font-bold text-[#0f172a]">Remote Hirring</span>
          </div>

          <h1 className="text-3xl font-bold text-[#0f172a] mb-2">Create an account</h1>
          <p className="text-slate-500 mb-8">Choose your account type to get started.</p>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              type="button"
              onClick={() => { setRole('recruiter'); setError('') }}
              className={`p-4 border-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-colors ${
                role === 'recruiter'
                  ? 'border-[#facc15] bg-[#fffbeb] text-[#0f172a]'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <Building2 size={24} className={role === 'recruiter' ? 'text-[#facc15]' : ''} />
              <span className="text-sm font-medium">I'm hiring</span>
            </button>
            <button
              type="button"
              onClick={() => { setRole('candidate'); setError('') }}
              className={`p-4 border-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-colors ${
                role === 'candidate'
                  ? 'border-[#facc15] bg-[#fffbeb] text-[#0f172a]'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <User size={24} className={role === 'candidate' ? 'text-[#facc15]' : ''} />
              <span className="text-sm font-medium">I'm a candidate</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Company Name — only for recruiter */}
            {role === 'recruiter' && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1 text-sm">Company Name</label>
                <input
                  type="text"
                  placeholder="Enter your company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full p-3 rounded-lg border border-slate-200 text-sm focus:border-[#facc15] outline-none"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1 text-sm">
                {role === 'recruiter' ? 'Work Email' : 'Email'}
              </label>
              <input
                type="email"
                placeholder={role === 'recruiter' ? 'you@company.com' : 'Enter your email'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 rounded-lg border border-slate-200 text-sm focus:border-[#facc15] outline-none"
              />
              {role === 'recruiter' && (
                <p className="text-xs text-slate-400 mt-1">
                  Please use your company email. Personal emails (Gmail, Yahoo, etc.) are not accepted.
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1 text-sm">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full p-3 pr-11 rounded-lg border border-slate-200 text-sm focus:border-[#facc15] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-1">Minimum 8 characters</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1 text-sm">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full p-3 pr-11 rounded-lg border border-slate-200 text-sm focus:border-[#facc15] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(v => !v)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {/* Match indicator */}
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
              {confirmPassword && password === confirmPassword && password.length >= 8 && (
                <p className="text-xs text-green-600 mt-1">Passwords match ✓</p>
              )}
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-black text-white py-4 rounded-full font-semibold hover:bg-slate-800 transition-colors disabled:opacity-60"
            >
              {loading ? 'Creating...' : 'Create Account'}
            </button>

            <p className="text-center text-sm text-slate-500 mt-4">
              Already have an account?{' '}
              <a href="/login" className="text-[#0f172a] font-semibold hover:underline">
                Log in
              </a>
            </p>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE - Hero */}
      <div className="hidden md:flex w-1/2 bg-[#0f172a] text-white flex-col justify-center px-20">
        <h2 className="text-4xl font-bold mb-4">Build your dream team.</h2>
        <p className="text-slate-300 text-lg leading-relaxed">
          Access the top 1% of global talent with our comprehensive remote hiring platform.
        </p>
      </div>
    </div>
  )
}