'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Bell, LogOut, User, Menu, Check } from 'lucide-react'

export default function DashboardTopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
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

  // Fetch notifications on mount + every 30 sec
  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch('/api/notifications')
        const data = await res.json()
        if (res.ok) {
          setNotifications(data.notifications || [])
          setUnreadCount(data.unreadCount || 0)
        }
      } catch (error) {
        // silent
      }
    }
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30_000)
    return () => clearInterval(interval)
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

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' })
    window.location.href = '/'
  }

    const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = searchQuery.trim()
    if (q) {
      window.location.href = `/dashboard/search?q=${encodeURIComponent(q)}`
    }
  }

  const closeAllMenus = () => {
    setIsOpen(false)
    setShowNotifications(false)
  }

  const handleNotificationClick = async (n: any) => {
    // Mark as read immediately for snappy UX
    setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))
    setUnreadCount(c => Math.max(0, c - (n.read ? 0 : 1)))

    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: n.id }),
      })
    } catch {
      // silent
    }

    setShowNotifications(false)
    if (n.link) router.push(n.link)
  }

  const handleMarkAllRead = async () => {
    setNotifications(prev => prev.map(x => ({ ...x, read: true })))
    setUnreadCount(0)
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: true }),
      })
    } catch {
      // silent
    }
  }

  const formatRelative = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const min = Math.floor(diff / 60_000)
    if (min < 1) return 'just now'
    if (min < 60) return `${min} min ago`
    const hr = Math.floor(min / 60)
    if (hr < 24) return `${hr} hr ago`
    const day = Math.floor(hr / 24)
    if (day < 7) return `${day} d ago`
    return new Date(dateStr).toLocaleDateString()
  }

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">

      {/* Row 1 */}
      <div className="px-4 md:px-8 py-3 flex items-center justify-between gap-3">

        <button
          onClick={onMenuClick}
          className="md:hidden w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center shrink-0"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5 text-slate-700" />
        </button>

        <span className="md:hidden font-bold text-slate-900 truncate">Dashboard</span>

        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            ref={desktopSearchRef}
            type="text"
            placeholder="Search candidates, jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-16 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#facc15]"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-400">
            Ctrl K
          </span>
        </form>

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
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <div className="absolute top-12 right-0 bg-white border border-slate-200 rounded-xl shadow-lg w-80 max-w-[calc(100vw-2rem)] z-50 overflow-hidden">

                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-semibold text-[#0f172a]">Notifications</p>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="p-6 text-center text-slate-400 text-sm">
                        No notifications yet.
                      </p>
                    ) : (
                      notifications.map((n) => (
                        <button
                          key={n.id}
                          onClick={() => handleNotificationClick(n)}
                          className={`w-full text-left p-3 border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors ${
                            !n.read ? 'bg-blue-50/40' : ''
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {!n.read && (
                              <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                            )}
                            {n.read && <span className="w-2 shrink-0" />}
                            <div className="min-w-0 flex-1">
                              <p className={`text-xs ${!n.read ? 'font-semibold text-slate-800' : 'text-slate-700'}`}>
                                {n.title}
                              </p>
                              <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                                {n.message}
                              </p>
                              <p className="text-[10px] text-slate-400 mt-1">
                                {formatRelative(n.createdAt)}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
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
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#facc15]"
          />
        </form>
      </div>

    </header>
  )
}