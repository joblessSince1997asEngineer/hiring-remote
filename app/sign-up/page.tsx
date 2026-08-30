'use client'
import { useState } from 'react'

export default function SignUpPage() {
  const [role, setRole] = useState('candidate')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      })

      const data = await res.json()

      if (res.ok) {
        document.cookie = `userId=${data.user.id}; path=/`
        window.location.href = '/'
      } else {
        setError(data.error || 'Something went wrong')
      }
    } catch (err) {
      setError('Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md border">
      <h1 className="text-2xl font-bold mb-6">Create Account</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <button type="button" onClick={() => setRole('recruiter')} className={`p-4 border-2 rounded-xl ${role === 'recruiter' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'}`}>I'm hiring</button>
          <button type="button" onClick={() => setRole('candidate')} className={`p-4 border-2 rounded-xl ${role === 'candidate' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'}`}>I'm a candidate</button>
        </div>
        <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border rounded-lg" />
        <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border rounded-lg" />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="w-full bg-black text-white py-3 rounded-full font-bold">
          {loading ? 'Creating...' : 'Sign Up'}
        </button>
      </form>
      <p className="mt-4 text-center">Already have an account? <a href="/login" className="text-blue-600">Login</a></p>
    </div>
  )
}