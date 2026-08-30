import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getUserApplications } from '@/lib/queries'

export default async function ApplicationsPage() {
  // 1. Read the cookie we set in auth-actions
  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')?.value

  // 2. If no user ID is found, send them to login
  if (!userId) redirect('/login')

  // 3. Fetch the real applications from Supabase
  const applications = await getUserApplications(userId)

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <h1 className="text-2xl font-bold mb-6 text-slate-900">My Applications</h1>
        {applications.length === 0 ? (
          <p className="text-slate-500">You haven't applied to any jobs yet.</p>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="border border-slate-200 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">{app.job.title}</h3>
                  <p className="text-sm text-slate-500">{app.job.company}</p>
                  <p className="text-sm text-slate-400 mt-1">Applied: {new Date(app.appliedAt).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  app.status === 'reviewed' ? 'bg-blue-100 text-blue-700' :
                  app.status === 'hired' ? 'bg-green-100 text-green-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}