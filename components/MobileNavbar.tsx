'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden relative z-50">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-slate-700 focus:outline-none relative z-50"
        aria-label="Open menu"
      >
        {isOpen ? (
          // X icon when open
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          // Hamburger icon when closed
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Click-outside overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg p-4 z-50 w-64">
          <div className="flex flex-col gap-4">
            <Link href="/" onClick={() => setIsOpen(false)} className="text-slate-700 font-medium no-underline">Home</Link>
            <Link href="/services" onClick={() => setIsOpen(false)} className="text-slate-700 font-medium no-underline">Services</Link>
            <Link href="/process" onClick={() => setIsOpen(false)} className="text-slate-700 font-medium no-underline">Process</Link>
            <Link href="/team" onClick={() => setIsOpen(false)} className="text-slate-700 font-medium no-underline">Team</Link>
            <Link href="/jobs" onClick={() => setIsOpen(false)} className="text-slate-700 font-medium no-underline">Jobs</Link>
            <Link href="/pricing" onClick={() => setIsOpen(false)} className="text-slate-700 font-medium no-underline">Our Fee Structure</Link>
            <Link href="/about" onClick={() => setIsOpen(false)} className="text-slate-700 font-medium no-underline">About</Link>
          </div>
        </div>
      )}
    </div>
  )
}