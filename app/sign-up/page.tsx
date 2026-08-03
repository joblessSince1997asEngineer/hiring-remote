'use client'

import { useState } from 'react'
import { Building2, User } from 'lucide-react'
import Link from 'next/link'

export default function SignUpPage() {
  const [role, setRole] = useState<'hiring' | 'candidate'>('hiring')

  return (
    <div className="flex min-h-screen bg-white">
      {/* LEFT SIDE - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 bg-[#fcfcfc]">
        <div className="max-w-md mx-auto w-full">
          
          {/* Logo - Yellow/Orange accent per your first screenshot */}
          <div className="flex items-center gap-2 mb-10">
            <div className="w-10 h-10 rounded-full bg-[#f59e0b] flex items-center justify-center text-white">
              <Building2 size={20} className="fill-current" />
            </div>
            <span className="text-xl font-bold tracking-tight">Remote Hiring</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Create an account</h1>
          <p className="text-slate-500 mb-8">Choose your account type to get started.</p>

          {/* Role Selector - I'm Hiring vs Candidate */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => setRole('hiring')}
              className={`flex flex-col items-center justify-center gap-1 p-4 rounded-xl border-2 transition-colors ${
                role === 'hiring'
                  ? 'border-[#f59e0b] bg-[#fffbeb] text-[#f59e0b]'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Building2 size={24} />
              <span className="text-sm font-medium">I'm hiring</span>
            </button>
            <button
              onClick={() => setRole('candidate')}
              className={`flex flex-col items-center justify-center gap-1 p-4 rounded-xl border-2 transition-colors ${
                role === 'candidate'
                  ? 'border-[#f59e0b] bg-[#fffbeb] text-[#f59e0b]'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <User size={24} />
              <span className="text-sm font-medium">I'm a candidate</span>
            </button>
          </div>

          {/* Inputs */}
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Company Name</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b] outline-none transition-all bg-white" 
                placeholder="Enter your company name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Work Email</label>
              <input 
                type="email" 
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b] outline-none transition-all bg-white" 
                placeholder="Enter your work email"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <input 
                type="password" 
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b] outline-none transition-all bg-white" 
                placeholder="Enter your password"
              />
            </div>

            <button 
              type="submit"
              className="w-full mt-6 bg-black text-white py-3.5 rounded-full font-semibold hover:bg-slate-800 transition-colors"
            >
              Create Account
            </button>

            {/* Link to Log In */}
            <p className="text-center text-sm text-slate-500 mt-6">
              Already have an account?{' '}
              <Link href="/login" className="text-[#f59e0b] font-medium hover:underline">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE - Dark Hero */}
      <div className="hidden lg:flex w-1/2 bg-[#0f172a] text-white flex-col justify-center px-24">
        <h2 className="text-4xl font-bold mb-4">Build your dream team.</h2>
        <p className="text-slate-300 text-lg leading-relaxed max-w-md">
          Access the top 1% of global talent with our comprehensive remote hiring platform.
        </p>
      </div>
    </div>
  )
}