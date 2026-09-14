'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Bell, LogOut, User, Menu } from 'lucide-react'

export default function DashboardTopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const desktopSearchRef = useRef<HTMLInputElement>(null)
  const mobileSearchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/account')
        const data = await res.json()
        if (res.ok) {
          setEmail(data.email || '')
          setRole(data.role || 'candidate')
        }
      } catch (error) {
        console.error('Failed to fetch user')
      }
    }
    fetchUser()
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        if (desktopSearchRef.current?.offsetParent !== null) {
          desktopSearchRef.current?.focus()
        } else {
          mobileSearchRef.current?.focus()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleLogout = () => {
    document.cookie = 'userId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    router.push('/')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/dashboard/candidates?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const closeAllMenus = () => {
    setIsOpen(false)
    setShowNotifications(false)
  }

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">

      {/* Row 1 */}
      <div className="px-4 md:px-8 py-3 flex items-center justify-between gap-3">

        {/* Hamburger (mobile only) */}
        <button
          onClick={onMenuClick}
          className="md:hidden w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center shrink-0"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5 text-slate-700" />
        </button>

        {/* Title (mobile only) */}
        <span className="md:hidden font-bold text-slate-900 truncate">Dashboard</span>

        {/* Search (desktop only) */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-md relative"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            ref={desktopSearchRef}
            type="text"
            placeholder="Search candidates, jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-16 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-400"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-400">
            Ctrl K
          </span>
        </form>

        {/* Right: bell + avatar */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">

          {/* Notification bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(v => !v)
                setIsOpen(false)
              }}
              className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <div className="absolute top-12 right-0 bg-white border border-slate-200 rounded-xl shadow-lg w-72 max-w-[calc(100vw-2rem)] p-3 z-50">
                  <p className="text-sm font-semibold text-[#0f172a] mb-3">Notifications</p>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    <div className="p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                      <p className="text-xs text-slate-700">New application received for Senior React Dev</p>
                      <p className="text-[10px] text-slate-400 mt-1">2 minutes ago</p>
                    </div>
                    <div className="p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                      <p className="text-xs text-slate-700">Client requested an interview for Candidate #_001</p>
                      <p className="text-[10px] text-slate-400 mt-1">15 minutes ago</p>
                    </div>
                    <div className="p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                      <p className="text-xs text-slate-700">Interview scheduled for tomorrow at 3:00 PM</p>
                      <p className="text-[10px] text-slate-400 mt-1">1 hour ago</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Avatar menu */}
          <div className="relative">
            <button
              onClick={() => {
                setIsOpen(v => !v)
                setShowNotifications(false)
              }}
              className="w-9 h-9 rounded-full bg-[#facc15] text-black font-bold text-sm flex items-center justify-center border-none cursor-pointer"
              aria-label="Account menu"
            >
              {email ? email.charAt(0).toUpperCase() : 'U'}
            </button>

            {isOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={closeAllMenus} />
                <div className="absolute top-12 right-0 bg-white border border-slate-200 rounded-xl shadow-lg w-56 max-w-[calc(100vw-2rem)] p-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="text-xs text-slate-500 truncate">{email}</p>
                    <p className="text-[10px] text-slate-400 capitalize mt-0.5">{role}</p>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={closeAllMenus}
                    className="flex items-center gap-2 p-2.5 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-50 no-underline"
                  >
                    <User className="w-4 h-4" />
                    Dashboard
                  </Link>

                  <Link
                    href="/account"
                    onClick={closeAllMenus}
                    className="flex items-center gap-2 p-2.5 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-50 no-underline"
                  >
                    <User className="w-4 h-4" />
                    My Account
                  </Link>

                  <div className="border-t border-slate-200 my-1"></div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-left p-2.5 text-red-600 text-sm font-medium rounded-md hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                </div>
              </>
            )}
          </div>

        </div>
      </div>

      {/* Row 2: mobile search */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            ref={mobileSearchRef}
            type="text"
            placeholder="Search candidates, jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-400"
          />
        </form>
      </div>

    </header>
  )
}