'use client'
import { useState } from 'react'

export default function AdminManagement() {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('admin')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const res = await fetch('/api/manage-admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      })

      const data = await res.json()
      if (res.ok) {
        setMessage(`Successfully updated ${email} as ${role}`)
        setEmail('')
      } else {
        setMessage(data.error || 'Error updating account')
      }
    } catch (err) {
      setMessage('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h2 className="text-lg font-bold mb-4">Set User Role</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="User Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 border border-slate-300 rounded-lg"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-3 border border-slate-300 rounded-lg"
        >
          <option value="admin">Admin</option>
          <option value="super_admin">Super Admin</option>
          <option value="candidate">Candidate</option>
          <option value="suspended">Suspended</option>
        </select>
        <button type="submit" disabled={loading} className="w-full bg-black text-white py-3 rounded-full font-bold">
          {loading ? 'Updating...' : 'Update Role'}
        </button>
      </form>
      {message && <p className="mt-4 text-sm text-slate-600">{message}</p>}
    </div>
  )
}