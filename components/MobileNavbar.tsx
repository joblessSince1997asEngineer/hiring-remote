'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="text-slate-700 focus:outline-none"
        aria-label="Open menu"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg p-4 z-50">
          <div className="flex flex-col gap-4">
            <Link href="/" onClick={() => setIsOpen(false)} className="text-slate-700 font-medium">Home</Link>
            <Link href="/services" onClick={() => setIsOpen(false)} className="text-slate-700 font-medium">Services</Link>
            <Link href="/process" onClick={() => setIsOpen(false)} className="text-slate-700 font-medium">Process</Link>
            <Link href="/team" onClick={() => setIsOpen(false)} className="text-slate-700 font-medium">Team</Link>
            <Link href="/jobs" onClick={() => setIsOpen(false)} className="text-slate-700 font-medium">Jobs</Link>
            <Link href="/pricing" onClick={() => setIsOpen(false)} className="text-slate-700 font-medium">Our Fee Structure</Link>
            <Link href="/about" onClick={() => setIsOpen(false)} className="text-slate-700 font-medium">About</Link>
          </div>
        </div>
      )}
    </div>
  )
}