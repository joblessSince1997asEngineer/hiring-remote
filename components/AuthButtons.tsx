'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function AuthButtons() {
  const [role, setRole] = useState<string | null | undefined>(undefined)
  const [email, setEmail] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/account')
        const data = await res.json()
        if (res.ok) {
          setRole(data.role || 'candidate')
          setEmail(data.email || '')
        } else {
          setRole(null)
        }
      } catch (error) {
        setRole(null)
      }
    }
    fetchUser()
  }, [])

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' })
    window.location.href = '/'
  }

  // While loading
  if (role === undefined) return null

  // Guest (Not logged in)
  if (role === null) {
    return (
      <>
        <Link href="/login" className="no-underline text-slate-700 font-medium text-sm hover:text-blue-600">Log in</Link>
        <Link href="/sign-up">
          <button className="bg-black text-white no-underline px-4 md:px-5 py-2 rounded-full font-semibold text-xs md:text-sm cursor-pointer">
            Get Started
          </button>
        </Link>
      </>
    )
  }

  // Logged in (Any Role) → Show Only the Avatar
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-[#facc15] text-black font-bold border-none cursor-pointer text-base flex items-center justify-center"
      >
        {email ? email.charAt(0).toUpperCase() : 'U'}
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 bg-white border border-slate-200 rounded-xl shadow-lg w-52 p-2 z-50">
          {/* Dashboard link — only for Admin and Recruiter */}
          {(role === 'admin' || role === 'recruiter') && (
            <>
              <Link
                href="/dashboard/applications"
                onClick={() => setIsOpen(false)}
                className="block p-2.5 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-50 no-underline"
              >
                Dashboard
              </Link>
              <div className="border-t border-slate-200 my-1"></div>
            </>
          )}

          <Link
            href="/account"
            onClick={() => setIsOpen(false)}
            className="block p-2.5 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-50 no-underline"
          >
            My Account
          </Link>

          <div className="border-t border-slate-200 my-1"></div>

          <button
            onClick={handleLogout}
            className="block w-full text-left p-2.5 text-red-600 text-sm font-medium rounded-md hover:bg-red-50"
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  )
}