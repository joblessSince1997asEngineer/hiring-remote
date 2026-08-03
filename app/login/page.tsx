'use client'

import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-white">
      {/* LEFT SIDE - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 bg-[#fcfcfc]">
        <div className="max-w-md mx-auto w-full">
          
          {/* Logo using Raw SVG to avoid import errors */}
          <div className="flex items-center gap-2 mb-10">
            <div className="w-10 h-10 rounded-full bg-[#2563eb] flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21h18" />
                <path d="M9 8h1" />
                <path d="M9 12h1" />
                <path d="M9 16h1" />
                <path d="M14 8h1" />
                <path d="M14 12h1" />
                <path d="M14 16h1" />
                <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">HiringRemote</span>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h1>
          <p className="text-slate-500 mb-8">Log in to your account to manage your hiring.</p>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Work Email</label>
              <input 
                type="email" 
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] outline-none transition-all bg-white" 
                placeholder="Enter your work email"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <input 
                type="password" 
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] outline-none transition-all bg-white" 
                placeholder="Enter your password"
              />
            </div>

            <button 
              type="submit"
              className="w-full mt-6 bg-black text-white py-3.5 rounded-full font-semibold hover:bg-slate-800 transition-colors"
            >
              Log In
            </button>

            <p className="text-center text-sm text-slate-500 mt-6">
              Don't have an account?{' '}
              <Link href="/sign-up" className="text-[#2563eb] font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE - Dark Hero */}
      <div className="hidden lg:flex w-1/2 bg-[#0f172a] text-white flex-col justify-center px-24">
        <h2 className="text-4xl font-bold mb-4">Welcome back, team.</h2>
        <p className="text-slate-300 text-lg leading-relaxed max-w-md">
          Continue building your distributed team and accessing the world's top 1% of global talent.
        </p>
      </div>
    </div>
  )
}