'use client'
import { useState } from 'react'
import { Building2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (res.ok) {
        document.cookie = `userId=${data.user.id}; path=/`
        window.location.href = '/'
      } else {
        setError(data.error || 'Invalid email or password')
      }
    } catch (err) {
      setError('Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* LEFT SIDE - Form */}
      <div style={{ width: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 60px', backgroundColor: '#fcfcfc' }}>
        <div style={{ maxWidth: '400px', margin: '0 auto', width: '100%' }}>
          
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <Building2 size={20} />
            </div>
            <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#0f172a' }}>Remote Hiring</span>
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}>Welcome back</h1>
          <p style={{ color: '#6b7280', marginBottom: '32px' }}>Log in to your account to continue.</p>

          {/* Inputs */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '600', color: '#334155', marginBottom: '6px', fontSize: '14px' }}>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontWeight: '600', color: '#334155', fontSize: '14px' }}>Password</label>
                <a href="/forgot-password" style={{ color: '#f59e0b', fontWeight: '500', fontSize: '14px', textDecoration: 'none' }}>
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }}
              />
            </div>

            {error && <p style={{ color: '#ef4444', fontSize: '14px' }}>{error}</p>}

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '16px', width: '100%', backgroundColor: 'black', color: 'white', padding: '16px',
                borderRadius: '9999px', fontWeight: '600', fontSize: '16px', border: 'none', cursor: 'pointer'
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <p style={{ textAlign: 'center', fontSize: '14px', color: '#6b7280', marginTop: '16px' }}>
              Don't have an account? <a href="/sign-up" style={{ color: '#f59e0b', fontWeight: '500', textDecoration: 'none' }}>Sign up</a>
            </p>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE - Dark Hero */}
      <div style={{ width: '50%', backgroundColor: '#0f172a', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 80px' }}>
        <h2 style={{ fontSize: '42px', fontWeight: 'bold', marginBottom: '16px' }}>The new standard in global hiring.</h2>
        <p style={{ color: '#94a3b8', fontSize: '18px', lineHeight: '1.6', maxWidth: '400px' }}>
          Join thousands of companies and professionals building the future of work together.
        </p>
      </div>
    </div>
  )
}