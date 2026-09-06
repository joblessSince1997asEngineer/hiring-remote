'use client'
import { useState } from 'react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const res = await fetch('/api/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    const data = await res.json()
    setMessage(data.message || data.error)
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md border">
      <h1 className="text-2xl font-bold mb-6">Forgot Password</h1>
      <p className="text-sm text-slate-500 mb-4">Enter your email to receive a 6-digit reset code.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" placeholder="Email Address" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border rounded-lg" />
        <button type="submit" disabled={loading} className="w-full bg-black text-white py-3 rounded-full font-bold">
          {loading ? 'Sending...' : 'Send Code'}
        </button>
      </form>

      {/* NEW: Show the link to the reset page after sending */}
      {message && (
        <div className="mt-4 p-4 bg-slate-50 rounded-lg text-center">
          <p className="text-sm text-slate-600 mb-2">{message}</p>
          <a href="/reset-password" className="text-blue-600 font-bold hover:underline">
            Enter the reset code here →
          </a>
        </div>
      )}

      <p className="mt-4 text-center">Remembered? <a href="/login" className="text-blue-600">Login</a></p>
    </div>
  )
}