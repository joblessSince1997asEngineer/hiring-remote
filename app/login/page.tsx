'use client'
import { useState } from 'react'
import { Building2, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (res.ok) {
        // Server already set the signed cookie — just navigate
        window.location.href = '/'
      } else {
        setError(data.error || 'Invalid email or password')
      }
    } catch (err) {
      setError('Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      {/* LEFT SIDE - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center p-6 md:px-24 bg-[#fcfcfc]">
        <div className="max-w-md mx-auto w-full">

          {/* Logo — left aligned */}
          <div className="flex items-center gap-2 mb-10">
            <div className="w-10 h-10 rounded-full bg-[#facc15] flex items-center justify-center text-slate-900">
              <Building2 size={20} />
            </div>
            <span className="text-xl font-bold text-[#0f172a]">Remote Hirring</span>
          </div>

          <h1 className="text-3xl font-bold text-[#0f172a] mb-2">Welcome back</h1>
          <p className="text-slate-500 mb-8">Log in to your account to continue.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1 text-sm">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 rounded-lg border border-slate-200 text-sm focus:border-[#facc15] outline-none"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-slate-700 text-sm">Password</label>
                <a href="/forgot-password" className="text-[#0f172a] font-semibold text-sm hover:underline">
                  Forgot password?
                </a>
              </div>
                            <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-black text-white py-4 rounded-full font-semibold hover:bg-slate-800 transition-colors disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <p className="text-center text-sm text-slate-500 mt-4">
              Don't have an account?{' '}
              <a href="/sign-up" className="text-[#0f172a] font-semibold hover:underline">
                Sign up
              </a>
            </p>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE - Dark Hero (hidden on mobile) */}
      <div className="hidden md:flex w-1/2 bg-[#0f172a] text-white flex-col justify-center px-20">
        <h2 className="text-4xl font-bold mb-4">The new standard in global hiring.</h2>
        <p className="text-slate-300 text-lg leading-relaxed">
          Join thousands of companies and professionals building the future of work together.
        </p>
      </div>
    </div>
  )
}