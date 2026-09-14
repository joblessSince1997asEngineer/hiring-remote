'use client'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts'
import { DollarSign, Trophy, Users, FileText } from 'lucide-react'

export default function AnalyticsView({ data }: { data: any }) {
  const { kpis, monthlyData, statusData, topJobs } = data

  const kpiCards = [
    { label: 'Total Placements', value: kpis.totalPlacements, icon: Trophy, color: 'bg-blue-500' },
    { label: 'Total Revenue', value: `$${kpis.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-green-500' },
    { label: 'Active Clients', value: kpis.activeClients, icon: Users, color: 'bg-yellow-500' },
    { label: 'Total Applications', value: kpis.totalApplications, icon: FileText, color: 'bg-purple-500' },
  ]

  const pieColors = ['#eab308', '#3b82f6', '#22c55e', '#ef4444']

  return (
    <div className="space-y-6">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon
          return (
            <div key={kpi.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className={`w-12 h-12 ${kpi.color} rounded-xl flex items-center justify-center mb-4 text-white`}>
                <Icon className="w-6 h-6" />
              </div>
              <p className="text-3xl font-bold text-[#0f172a] mb-1">{kpi.value}</p>
              <p className="text-sm text-slate-500">{kpi.label}</p>
            </div>
          )
        })}
      </div>

      {/* Monthly Hires Bar Chart */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-xl font-bold text-[#0f172a] mb-4">Monthly Hires (Last 6 Months)</h2>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="hires" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue + Status - Two Column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Monthly Revenue Line Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-xl font-bold text-[#0f172a] mb-4">Revenue (Last 6 Months)</h2>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value}`} />
                <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Applications by Status Pie Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-xl font-bold text-[#0f172a] mb-4">Applications by Status</h2>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {statusData.map((entry: any, index: number) => (
                    <Cell key={index} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Top Jobs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-xl font-bold text-[#0f172a] mb-4">Top Jobs by Applications</h2>
        {topJobs.length === 0 ? (
          <p className="text-slate-400 text-sm py-8 text-center">No jobs with applications yet.</p>
        ) : (
          <div className="space-y-3">
            {topJobs.map((job: any, index: number) => (
              <div key={index} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-b-0">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-500">
                    {index + 1}
                  </div>
                  <p className="font-medium text-[#0f172a] text-sm">{job.title}</p>
                </div>
                <span className="text-sm text-slate-500">
                  {job.applications} application{job.applications !== 1 ? 's' : ''}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}