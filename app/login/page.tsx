'use client'

import { Building2 } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      {/* LEFT SIDE - The Form */}
      <div style={{ width: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 60px', backgroundColor: '#fcfcfc' }}>
        <div style={{ maxWidth: '400px', margin: '0 auto', width: '100%' }}>
          
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <Building2 size={20} />
            </div>
            <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#0f172a' }}>Remote Hiring</span>
          </div>

          {/* Title */}
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}>Welcome back</h1>
          <p style={{ color: '#6b7280', marginBottom: '32px' }}>Log in to your account to manage your hiring.</p>

          {/* Inputs */}
          <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '600', color: '#334155', marginBottom: '6px', fontSize: '14px' }}>Work Email</label>
              <input 
                type="email" 
                placeholder="Enter your work email"
                style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '600', color: '#334155', marginBottom: '6px', fontSize: '14px' }}>Password</label>
              <input 
                type="password" 
                placeholder="Enter your password"
                style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }}
              />
            </div>

            <button 
              type="submit"
              style={{
                marginTop: '16px', width: '100%', backgroundColor: 'black', color: 'white', padding: '16px',
                borderRadius: '9999px', fontWeight: '600', fontSize: '16px', border: 'none', cursor: 'pointer'
              }}
            >
              Log In
            </button>

            <p style={{ textAlign: 'center', fontSize: '14px', color: '#6b7280', marginTop: '16px' }}>
              Don't have an account?{' '}
              <Link href="/sign-up" style={{ color: '#f59e0b', fontWeight: '500', textDecoration: 'none' }}>
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE - The Dark Hero */}
      <div style={{ width: '50%', backgroundColor: '#0f172a', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 80px' }}>
        <h2 style={{ fontSize: '42px', fontWeight: 'bold', marginBottom: '16px' }}>Welcome back, team.</h2>
        <p style={{ color: '#94a3b8', fontSize: '18px', lineHeight: '1.6', maxWidth: '400px' }}>
          Continue building your distributed team and accessing the world's top 1% of global talent.
        </p>
      </div>

    </div>
  )
}