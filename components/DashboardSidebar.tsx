'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Briefcase, Users, FileText, Calendar,
  Inbox, BarChart3, Settings, LogOut, CheckSquare, MessageSquare,
} from 'lucide-react'

export default function DashboardSidebar({
  role,
  isOpen,
  onClose,
}: {
  role: string
  isOpen: boolean
  onClose: () => void
}) {
  const pathname = usePathname()

  const handleLogout = () => {
    document.cookie = 'userId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    window.location.href = '/'
  }

  const menuItems = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, roles: ['admin', 'recruiter'] },
    { href: '/dashboard/jobs', label: 'Jobs', icon: Briefcase, roles: ['admin', 'recruiter'] },
    { href: '/dashboard/candidates', label: 'Candidates', icon: Users, roles: ['admin', 'recruiter'] },
    { href: '/dashboard/applications', label: 'Applications', icon: FileText, roles: ['admin', 'recruiter'] },
    { href: '/dashboard/interviews', label: 'Interviews', icon: Calendar, roles: ['admin', 'recruiter'] },
    { href: '/dashboard/hire-approvals', label: 'Hire Approvals', icon: CheckSquare, roles: ['admin'] },
    { href: '/dashboard/contact-messages', label: 'Contact Messages', icon: MessageSquare, roles: ['admin'] },
    { href: '/dashboard/client-requests', label: 'Client Requests', icon: Inbox, roles: ['admin'] },
    { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3, roles: ['admin'] },
    { href: '/dashboard/team', label: 'Team Management', icon: Settings, roles: ['admin'] },
  ]

  const visibleItems = menuItems.filter((item) => item.roles.includes(role))

  return (
    <>
      {/* Mobile overlay — tap to close */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-[#0f172a] text-white
          flex flex-col z-50 transition-transform duration-200
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        {/* Logo + Tagline */}
        <div className="px-6 py-5 border-b border-[#1e293b]">
          <Link href="/" className="block no-underline">
            <img src="/logo.png" alt="Remote Hirring" className="h-10 w-auto object-contain mb-1" />
            <span className="text-[10px] text-slate-400 font-normal leading-tight block">
              Great recruitment starts with a conversation
            </span>
          </Link>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {visibleItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors no-underline
                  ${isActive
                    ? 'bg-[#1e293b] text-yellow-400'
                    : 'text-slate-300 hover:bg-[#1e293b] hover:text-white'}`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-[#1e293b]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </button>
        </div>
      </aside>
    </>
  )
}