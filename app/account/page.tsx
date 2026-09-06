'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AccountPage() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch('/api/account')
      const data = await res.json()
      if (res.ok) setUser(data)
      else router.push('/login')
    }
    fetchUser()
  }, [router])

  const handleLogout = () => {
    document.cookie = 'userId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    router.push('/')
  }

  if (!user) return <p className="mt-10 text-center">Loading...</p>

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md border">
      <h1 className="text-2xl font-bold mb-6">My Account</h1>
      <p className="text-slate-700"><strong>Email:</strong> {user.email}</p>
      <p className="mt-2 text-slate-700"><strong>Role:</strong> {user.role}</p>
      <button 
        onClick={handleLogout} 
        className="w-full bg-red-500 text-white py-3 rounded-full font-bold mt-6 hover:bg-red-600"
      >
        Log Out
      </button>
    </div>
  )
}