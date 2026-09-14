'use client'

import { useState } from 'react'
import DashboardSidebar from './DashboardSidebar'
import DashboardTopBar from './DashboardTopBar'

export default function DashboardShell({
  role,
  children,
}: {
  role: string
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <DashboardSidebar
        role={role}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="md:ml-64">
        <DashboardTopBar onMenuClick={() => setSidebarOpen(true)} />
        <main>{children}</main>
      </div>
    </div>
  )
}