'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AccountPage() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/account')
        const data = await res.json()
        if (res.ok) setUser(data)
        else router.push('/login')
      } catch (error) {
        console.error('Failed to fetch user:', error)
      }
    }
    fetchUser()
  }, [router])

  const handleLogout = () => {
    document.cookie = 'userId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    router.push('/')
  }

  if (!user) return <p className="mt-10 text-center">Loading...</p>

  return (
    // Container: full width on mobile, centered with padding on desktop
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 md:p-6">
      
      {/* Card: full width on mobile, 28rem (max-w-md) on desktop */}
      <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 md:p-8 w-full max-w-md">
        
        <div className="flex items-center gap-3 mb-6">
          {/* Avatar showing initial */}
          <div className="w-12 h-12 rounded-full bg-[#facc15] flex items-center justify-center text-black font-bold text-xl">
            {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
          </div>
          <h1 className="text-2xl font-bold text-[#0f172a]">My Account</h1>
        </div>

        {/* User Details */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b border-slate-100 pb-3">
            <span className="text-sm font-medium text-slate-500">Email</span>
            <span className="text-sm font-semibold text-[#0f172a] break-all">{user.email}</span>
          </div>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b border-slate-100 pb-3">
            <span className="text-sm font-medium text-slate-500">Role</span>
            <span className="text-sm font-semibold text-[#0f172a] capitalize">{user.role}</span>
          </div>
        </div>

        {/* Logout Button: full width on mobile, auto on desktop */}
        <button 
          onClick={handleLogout} 
          className="w-full bg-red-500 text-white py-3 rounded-full font-bold hover:bg-red-600 transition-colors"
        >
          Log Out
        </button>
      </div>
    </div>
  )
}