'use client'

export default function FounderDashboard({ stats }: { stats: { activeJobs: number; totalApplications: number; pendingApplications: number } }) {
  const metrics = [
    { label: 'Active Jobs', value: stats.activeJobs, color: 'bg-blue-500' },
    { label: 'Total Applications', value: stats.totalApplications, color: 'bg-green-500' },
    { label: 'Pending Review', value: stats.pendingApplications, color: 'bg-yellow-500' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {metrics.map((metric) => (
        <div key={metric.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className={`w-12 h-12 rounded-xl ${metric.color} mb-4`}></div>
          <h2 className="text-2xl font-bold text-slate-900">{metric.value}</h2>
          <p className="text-slate-500">{metric.label}</p>
        </div>
      ))}
    </div>
  )
}