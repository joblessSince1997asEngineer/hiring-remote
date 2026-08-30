import AdminManagement from '@/components/AdminManagement'

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Manage Admin Accounts</h1>
      <AdminManagement />
    </div>
  )
}