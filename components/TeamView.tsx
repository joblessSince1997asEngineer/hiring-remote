'use client'
import { useState } from 'react'
import { Shield, User, UserX, UserCheck } from 'lucide-react'

export default function TeamView({ members }: { members: any[] }) {
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const handleToggleSchedule = async (userId: string, currentValue: boolean) => {
    setActionLoading(userId)
    try {
      const res = await fetch('/api/team/update-permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, allowRecruiterSchedule: !currentValue }),
      })
      if (res.ok) {
        window.location.reload()
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to update')
      }
    } finally {
      setActionLoading(null)
    }
  }

  const handleToggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'recruiter' : 'admin'
    const confirmed = confirm(`Change this user's role to "${newRole}"?`)
    if (!confirmed) return

    setActionLoading(userId)
    try {
      const res = await fetch('/api/team/update-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      })
      if (res.ok) {
        window.location.reload()
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to update')
      }
    } finally {
      setActionLoading(null)
    }
  }

  const handleSuspend = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'suspended' ? 'recruiter' : 'suspended'
    const action = newRole === 'suspended' ? 'suspend' : 'restore'
    const confirmed = confirm(`Are you sure you want to ${action} this user?`)
    if (!confirmed) return

    setActionLoading(userId)
    try {
      const res = await fetch('/api/team/update-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      })
      if (res.ok) {
        // If suspending, forcibly log them out
        if (newRole === 'suspended') {
          await fetch('/api/team/force-logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId }),
          })
        }
        window.location.reload()
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to update')
      }
    } finally {
      setActionLoading(null)
    }
  }

  const getRoleBadge = (role: string) => {
    const styles: any = {
      admin: 'bg-purple-100 text-purple-700',
      recruiter: 'bg-blue-100 text-blue-700',
      suspended: 'bg-red-100 text-red-700',
      candidate: 'bg-slate-100 text-slate-600',
    }
    return styles[role] || styles.candidate
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Email</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Role</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Can Schedule Interviews</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-400 text-sm">No team members found.</td>
              </tr>
            ) : (
              members.map((member) => (
                <tr key={member.userId} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-[#0f172a] text-sm font-medium">
                    {member.email}
                    {member.isCurrentUser && (
                      <span className="ml-2 text-xs text-slate-400">(You)</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${getRoleBadge(member.role)}`}>
                      {member.role}
                    </span>
                  </td>
                  <td className="p-4">
                    {member.role === 'recruiter' ? (
                      <button
                        onClick={() => handleToggleSchedule(member.userId, member.allowRecruiterSchedule)}
                        disabled={actionLoading === member.userId}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          member.allowRecruiterSchedule ? 'bg-green-500' : 'bg-slate-300'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            member.allowRecruiterSchedule ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400">N/A</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {!member.isCurrentUser && (
                        <>
                          <button
                            onClick={() => handleToggleRole(member.userId, member.role)}
                            disabled={actionLoading === member.userId}
                            className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-200 font-medium flex items-center gap-1"
                          >
                            <Shield className="w-3 h-3" />
                            {member.role === 'admin' ? 'Make Recruiter' : 'Make Admin'}
                          </button>
                          <button
                            onClick={() => handleSuspend(member.userId, member.role)}
                            disabled={actionLoading === member.userId}
                            className={`text-xs px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 ${
                              member.role === 'suspended'
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                            }`}
                          >
                            {member.role === 'suspended' ? (
                              <>
                                <UserCheck className="w-3 h-3" /> Restore
                              </>
                            ) : (
                              <>
                                <UserX className="w-3 h-3" /> Suspend
                              </>
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}