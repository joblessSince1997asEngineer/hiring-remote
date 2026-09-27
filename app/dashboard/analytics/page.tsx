'use client'

import { useEffect, useState } from 'react'
import {
  Briefcase,
  Users,
  FileText,
  Calendar,
  CheckCircle,
  DollarSign,
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

type KPI = {
  jobs: number
  candidates: number
  applications: number
  interviews: number
  hires: number
  revenue: number
  conversionRate: number
}

type AnalyticsData = {
  kpi: KPI
  applicationsOverTime: { date: string; count: number }[]
  hiresPerMonth: { month: string; count: number }[]
  categories: { category: string; count: number }[]
}

const BRAND = {
  navy: '#0f172a',
  amber: '#facc15',
}

const PIE_COLORS = [
  '#0f172a',
  '#facc15',
  '#64748b',
  '#3b82f6',
  '#ef4444',
  '#22c55e',
  '#a855f7',
]

export default function AnalyticsPage() {
  const [range, setRange] = useState<'7d' | '30d' | '90d' | 'all'>('all')
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetch(`/api/analytics?range=${range}`)
      .then(async (r) => {
        if (!r.ok) {
          const err = await r.json().catch(() => ({}))
          throw new Error(err.error || `Error ${r.status}`)
        }
        return r.json()
      })
      .then((json) => {
        if (!cancelled) setData(json)
      })
      .catch((e) => {
        if (!cancelled) setError(e.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [range])

  const isEmpty =
    data &&
    data.kpi.jobs === 0 &&
    data.kpi.applications === 0 &&
    data.kpi.interviews === 0 &&
    data.kpi.hires === 0

  return (
    <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">
            Analytics Dashboard
          </h1>
          <p className="text-sm text-[#64748b] mt-1">
            Overview of your recruitment platform
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-2 flex-wrap">
          {(['7d', '30d', '90d', 'all'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                range === r
                  ? 'bg-[#0f172a] text-white border-[#0f172a]'
                  : 'bg-white text-[#64748b] border-slate-200 hover:border-slate-300'
              }`}
            >
              {r === 'all' ? 'All Time' : r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-sm text-slate-500">Loading analytics...</p>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Data */}
      {!loading && !error && data && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            <KpiCard
              icon={<Briefcase />}
              label="Jobs"
              value={data.kpi.jobs}
            />
            <KpiCard
              icon={<Users />}
              label="Candidates"
              value={data.kpi.candidates}
            />
            <KpiCard
              icon={<FileText />}
              label="Applications"
              value={data.kpi.applications}
            />
            <KpiCard
              icon={<Calendar />}
              label="Interviews"
              value={data.kpi.interviews}
            />
            <KpiCard
              icon={<CheckCircle />}
              label="Hires"
              value={data.kpi.hires}
            />
            <KpiCard
              icon={<DollarSign />}
              label="Revenue"
              value={`$${data.kpi.revenue.toLocaleString()}`}
            />
          </div>

          {/* Conversion rate */}
          <div className="mb-6 p-4 bg-white border border-slate-200 rounded-xl">
            <p className="text-xs text-[#64748b]">
              Conversion Rate (Hires / Applications)
            </p>
            <p className="text-2xl font-bold text-[#0f172a] mt-1">
              {data.kpi.conversionRate}%
            </p>
          </div>

          {/* Empty state */}
          {isEmpty ? (
            <div className="p-12 bg-white border border-slate-200 rounded-xl text-center">
              <p className="text-slate-500 text-sm">
                No data yet for this period. Try changing the filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Line chart: Applications over time */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 lg:col-span-2">
                <h3 className="text-sm font-semibold text-[#0f172a] mb-3">
                  Applications Over Time
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={data.applicationsOverTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke={BRAND.navy}
                      strokeWidth={2}
                      dot={{ fill: BRAND.amber, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Bar chart: Hires per month */}
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-[#0f172a] mb-3">
                  Hires Per Month
                </h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={data.hiresPerMonth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar
                      dataKey="count"
                      fill={BRAND.amber}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie chart: Jobs by category */}
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-[#0f172a] mb-3">
                  Jobs by Category
                </h3>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={data.categories}
                      dataKey="count"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry: { category?: string }) =>
                        entry.category || ''
                      }
                    >
                      {data.categories.map((_, i) => (
                        <Cell
                          key={i}
                          fill={PIE_COLORS[i % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function KpiCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="flex items-center gap-2 text-[#64748b] mb-2">
        <span className="w-4 h-4 [&>svg]:w-4 [&>svg]:h-4">{icon}</span>
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="text-xl font-bold text-[#0f172a]">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
    </div>
  )
}