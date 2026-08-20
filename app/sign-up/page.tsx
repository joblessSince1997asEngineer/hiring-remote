'use client'

import { useState } from 'react'
import { Building2, User } from 'lucide-react'
import Link from 'next/link'

export default function SignUpPage() {
  const [role, setRole] = useState<'hiring' | 'candidate'>('hiring')

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
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}>Create an account</h1>
          <p style={{ color: '#6b7280', marginBottom: '32px' }}>Choose your account type to get started.</p>

          {/* Role Selector */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
            <button
              onClick={() => setRole('hiring')}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '20px', borderRadius: '12px', border: role === 'hiring' ? '2px solid #f59e0b' : '1px solid #e5e7eb',
                backgroundColor: role === 'hiring' ? '#fffbeb' : 'white', color: role === 'hiring' ? '#f59e0b' : '#475569',
                cursor: 'pointer'
              }}
            >
              <Building2 size={28} />
              <span style={{ fontSize: '14px', fontWeight: '500' }}>I'm hiring</span>
            </button>
            <button
              onClick={() => setRole('candidate')}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '20px', borderRadius: '12px', border: role === 'candidate' ? '2px solid #f59e0b' : '1px solid #e5e7eb',
                backgroundColor: role === 'candidate' ? '#fffbeb' : 'white', color: role === 'candidate' ? '#f59e0b' : '#475569',
                cursor: 'pointer'
              }}
            >
              <User size={28} />
              <span style={{ fontSize: '14px', fontWeight: '500' }}>I'm a candidate</span>
            </button>
          </div>

          {/* Inputs */}
          <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '600', color: '#334155', marginBottom: '6px', fontSize: '14px' }}>Company Name</label>
              <input 
                type="text" 
                placeholder="Enter your company name"
                style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }}
              />
            </div>
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
              Create Account
            </button>

            <p style={{ textAlign: 'center', fontSize: '14px', color: '#6b7280', marginTop: '16px' }}>
              Already have an account?{' '}
              <Link href="/login" style={{ color: '#f59e0b', fontWeight: '500', textDecoration: 'none' }}>
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE - The Dark Hero */}
      <div style={{ width: '50%', backgroundColor: '#0f172a', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 80px' }}>
        <h2 style={{ fontSize: '42px', fontWeight: 'bold', marginBottom: '16px' }}>Build your dream team.</h2>
        <p style={{ color: '#94a3b8', fontSize: '18px', lineHeight: '1.6', maxWidth: '400px' }}>
          Access the top 1% of global talent with our comprehensive remote hiring platform.
        </p>
      </div>

    </div>
  )
}