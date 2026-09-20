'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Briefcase, Calendar, Video, Clock, ExternalLink, CheckCircle2, User, ArrowRight, Bookmark } from 'lucide-react'

type Status = 'pending' | 'shortlisted' | 'hire_pending' | 'awaiting_payment' | 'hired' | 'rejected' | 'hire_cancelled'

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  shortlisted: 'bg-blue-100 text-blue-700',
  hire_pending: 'bg-purple-100 text-purple-700',
  awaiting_payment: 'bg-orange-100 text-orange-700',
  hired: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  hire_cancelled: 'bg-red-100 text-red-700',
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending Review',
  shortlisted: 'Shortlisted',
  hire_pending: 'Hire Requested',
  awaiting_payment: 'Hire Approved',
  hired: 'Hired 🎉',
  rejected: 'Not Selected',
  hire_cancelled: 'Hire Cancelled',
}

export default function AccountPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/candidate/dashboard')
        const json = await res.json()
        if (res.ok) setData(json)
        else router.push('/login')
      } catch (err) {
        console.error('Failed to fetch:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [router])

  const handleLogout = () => {
    document.cookie = 'userId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    window.location.href = '/'
  }

  if (loading) return <p className="mt-10 text-center text-slate-500">Loading...</p>
  if (!data) return <p className="mt-10 text-center text-red-500">Failed to load.</p>

  const { user, applications, interviews } = data

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 md:py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#facc15] flex items-center justify-center text-black font-bold text-2xl">
                {user.email.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#0f172a]">My Account</h1>
                <p className="text-sm text-slate-500 break-all">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-red-600 transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>
                {/* Profile card */}
        <Link
          href="/account/profile"
          className="block bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:border-[#facc15] transition-colors group"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-slate-600" />
              </div>
              <div className="min-w-0">
                <h2 className="font-bold text-[#0f172a]">My Profile</h2>
                <p className="text-sm text-slate-500 truncate">
                  Keep your skills, CV, and experience up to date so clients can find you.
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-[#facc15] group-hover:translate-x-1 transition-all shrink-0" />
          </div>
        </Link>
                {/* Saved Jobs card */}
        <Link
          href="/account/saved-jobs"
          className="block bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:border-[#facc15] transition-colors group"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                <Bookmark className="w-5 h-5 text-slate-600" />
              </div>
              <div className="min-w-0">
                <h2 className="font-bold text-[#0f172a]">Saved Jobs</h2>
                <p className="text-sm text-slate-500 truncate">
                  Jobs you bookmarked to review or apply later.
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-[#facc15] group-hover:translate-x-1 transition-all shrink-0" />
          </div>
        </Link>

        {/* My Applications */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
          <div className="flex items-center gap-2 mb-5">
            <Briefcase className="w-5 h-5 text-slate-700" />
            <h2 className="text-xl font-bold text-[#0f172a]">
              My Applications
              <span className="ml-2 text-sm font-normal text-slate-400">({applications.length})</span>
            </h2>
          </div>

          {applications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400 text-sm mb-4">You haven't applied to any jobs yet.</p>
              <Link
                href="/jobs"
                className="inline-block bg-[#0f172a] text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-slate-800"
              >
                Browse Jobs
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app: any) => (
                <div
                  key={app.id}
                  className="border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-[#0f172a] truncate">{app.job.title}</h3>
                    <p className="text-sm text-slate-500 truncate">{app.job.company}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Applied {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap ${STATUS_STYLES[app.status] || 'bg-slate-100 text-slate-700'}`}>
                    {STATUS_LABELS[app.status] || app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Interviews */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
          <div className="flex items-center gap-2 mb-5">
            <Calendar className="w-5 h-5 text-slate-700" />
            <h2 className="text-xl font-bold text-[#0f172a]">
              My Interviews
              <span className="ml-2 text-sm font-normal text-slate-400">({interviews.length})</span>
            </h2>
          </div>

          {interviews.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-6">
              No interviews scheduled yet.
            </p>
          ) : (
            <div className="space-y-3">
              {interviews.map((interview: any) => (
                <div key={interview.id} className="border border-slate-200 rounded-xl p-4">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-semibold text-[#0f172a]">
                        {interview.job?.title || 'Interview'}
                      </h3>
                      <p className="text-sm text-slate-500">{interview.job?.company || ''}</p>
                    </div>
                    <span className={`text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap self-start ${
                      interview.status === 'completed' ? 'bg-green-100 text-green-700' :
                      interview.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                      interview.status === 'completion_requested' ? 'bg-purple-100 text-purple-700' :
                      interview.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {interview.status === 'completion_requested' ? 'Awaiting Confirmation' :
                       interview.status === 'scheduled' ? 'Scheduled' :
                       interview.status === 'completed' ? 'Completed' :
                       interview.status === 'cancelled' ? 'Cancelled' :
                       'Pending Scheduling'}
                    </span>
                  </div>

                  {interview.scheduledDate && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-3">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {new Date(interview.scheduledDate).toLocaleDateString(undefined, {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Clock className="w-4 h-4 text-slate-400" />
                        {new Date(interview.scheduledDate).toLocaleTimeString(undefined, {
                          hour: '2-digit',
                          minute: '2-digit',
                        })} • {interview.timeZone}
                      </div>
                    </div>
                  )}

                  {interview.videoLink && interview.status !== 'cancelled' && (
                    <a
                      href={interview.videoLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 bg-[#0f172a] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
                    >
                      <Video className="w-4 h-4" />
                      Join Video Call
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {interview.candidateNotes && (
                    <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Notes from interviewer</p>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap">{interview.candidateNotes}</p>
                    </div>
                  )}

                  {interview.status === 'completed' && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-green-700">
                      <CheckCircle2 className="w-4 h-4" />
                      Interview completed
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}