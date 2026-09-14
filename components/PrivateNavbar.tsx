'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PrivateNavbar() {
  const [role, setRole] = useState<string | null>(null)
  const [email, setEmail] = useState<string>('') // Added email state
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function fetchUser() {
      try {
        // Fetch account API instead of check-role, because it returns BOTH email and role
        const res = await fetch('/api/account')
        const data = await res.json()
        if (res.ok) {
          setEmail(data.email || '')
          setRole(data.role || 'user')
        } else {
          setRole(null)
        }
      } catch (error) {
        console.error('Failed to fetch user:', error)
      }
    }
    fetchUser()
  }, [])

  const handleLogout = () => {
    document.cookie = 'userId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    router.push('/')
  }

  if (!role) return null

  return (
    <div style={{ position: 'relative' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '40px', height: '40px', borderRadius: '50%',
          backgroundColor: '#facc15', color: 'black', fontWeight: 'bold',
          border: 'none', cursor: 'pointer', fontSize: '18px'
        }}
      >
        {/* THE FIX: Uses the first letter of the EMAIL instead of ROLE */}
        {email ? email.charAt(0).toUpperCase() : 'U'}
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute', top: '50px', right: '0',
          backgroundColor: 'white', border: '1px solid #e2e8f0',
          borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
          width: '200px', padding: '8px', zIndex: 100
        }}>
          
          <Link href="/account" onClick={() => setIsOpen(false)} style={{ display: 'block', padding: '10px', textDecoration: 'none', color: '#1e293b', fontSize: '14px', fontWeight: '500', borderRadius: '6px' }} className="hover:bg-slate-50">
            My Account
          </Link>

          {role === 'super_admin' && (
            <>
              <Link href="/dashboard/post" onClick={() => setIsOpen(false)} style={{ display: 'block', padding: '10px', textDecoration: 'none', color: '#1e293b', fontSize: '14px', fontWeight: '500', borderRadius: '6px' }} className="hover:bg-slate-50">
                Post a Job
              </Link>
              <Link href="/admin" onClick={() => setIsOpen(false)} style={{ display: 'block', padding: '10px', textDecoration: 'none', color: '#1e293b', fontSize: '14px', fontWeight: '500', borderRadius: '6px' }} className="hover:bg-slate-50">
                Admin Panel
              </Link>
              <Link href="/client" onClick={() => setIsOpen(false)} style={{ display: 'block', padding: '10px', textDecoration: 'none', color: '#1e293b', fontSize: '14px', fontWeight: '500', borderRadius: '6px' }} className="hover:bg-slate-50">
                Client Dashboard
              </Link>
              <Link href="/founder" onClick={() => setIsOpen(false)} style={{ display: 'block', padding: '10px', textDecoration: 'none', color: '#1e293b', fontSize: '14px', fontWeight: '500', borderRadius: '6px' }} className="hover:bg-slate-50">
                Founder Dashboard
              </Link>
              <Link href="/founder/admins" onClick={() => setIsOpen(false)} style={{ display: 'block', padding: '10px', textDecoration: 'none', color: '#1e293b', fontSize: '14px', fontWeight: '500', borderRadius: '6px' }} className="hover:bg-slate-50">
                Manage Admin Accounts
              </Link>
            </>
          )}
          {role === 'admin' && (
            <>
              <Link href="/dashboard/post" onClick={() => setIsOpen(false)} style={{ display: 'block', padding: '10px', textDecoration: 'none', color: '#1e293b', fontSize: '14px', fontWeight: '500', borderRadius: '6px' }} className="hover:bg-slate-50">
                Post a Job
              </Link>
              <Link href="/admin" onClick={() => setIsOpen(false)} style={{ display: 'block', padding: '10px', textDecoration: 'none', color: '#1e293b', fontSize: '14px', fontWeight: '500', borderRadius: '6px' }} className="hover:bg-slate-50">
                Admin Panel
              </Link>
              <Link href="/client" onClick={() => setIsOpen(false)} style={{ display: 'block', padding: '10px', textDecoration: 'none', color: '#1e293b', fontSize: '14px', fontWeight: '500', borderRadius: '6px' }} className="hover:bg-slate-50">
                Client Dashboard
              </Link>
            </>
          )}
          {role === 'recruiter' && (
            <>
              <Link href="/dashboard/post" onClick={() => setIsOpen(false)} style={{ display: 'block', padding: '10px', textDecoration: 'none', color: '#1e293b', fontSize: '14px', fontWeight: '500', borderRadius: '6px' }} className="hover:bg-slate-50">
                Post a Job
              </Link>
              <Link href="/client" onClick={() => setIsOpen(false)} style={{ display: 'block', padding: '10px', textDecoration: 'none', color: '#1e293b', fontSize: '14px', fontWeight: '500', borderRadius: '6px' }} className="hover:bg-slate-50">
                Client Dashboard
              </Link>
            </>
          )}

          <div style={{ borderTop: '1px solid #e2e8f0', margin: '8px 0' }}></div>
          
          <button onClick={handleLogout} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px', color: '#dc2626', fontSize: '14px', fontWeight: '500', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: '6px' }} className="hover:bg-red-50">
            Log Out
          </button>
        </div>
      )}
    </div>
  )
}