'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function FounderDashboard({ stats, chartData }: { stats: { activeJobs: number; totalApplications: number; pendingApplications: number }, chartData: { month: string; hires: number }[] }) {
  const metrics = [
    { label: 'Active Jobs', value: stats.activeJobs, color: 'bg-blue-500' },
    { label: 'Total Applications', value: stats.totalApplications, color: 'bg-green-500' },
    { label: 'Pending Review', value: stats.pendingApplications, color: 'bg-yellow-500' },
  ]

  return (
    <div className="space-y-8">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className={`w-12 h-12 rounded-xl ${metric.color} mb-4`}></div>
            <h2 className="text-2xl font-bold text-slate-900">{metric.value}</h2>
            <p className="text-slate-500">{metric.label}</p>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Placements (Last 6 Months)</h2>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="hires" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}