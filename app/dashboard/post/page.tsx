import { PostJobForm } from '@/components/PostJobForm'

export default function PostJobPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h1 className="text-2xl font-bold mb-6">Post a New Role</h1>
        <PostJobForm />
      </div>
    </div>
  )
}