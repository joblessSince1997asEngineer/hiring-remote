export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-red-600 mb-4">403</h1>
        <p className="text-slate-600 mb-6">You do not have permission to access this page.</p>
        <a href="/" className="text-blue-600 font-semibold hover:underline">Go back to Home</a>
      </div>
    </div>
  )
}