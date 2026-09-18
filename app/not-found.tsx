import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center px-6 py-16">
      <div className="max-w-lg w-full text-center">
        <p className="text-8xl md:text-9xl font-black text-[#facc15] leading-none mb-4">
          404
        </p>

        <h1 className="text-2xl md:text-4xl font-bold mb-3">
          Page not found
        </h1>

        <p className="text-slate-300 mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="bg-[#facc15] text-slate-900 px-6 py-3 rounded-full font-semibold hover:bg-yellow-300 transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/jobs"
            className="border border-slate-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-white/5 transition-colors"
          >
            Browse Jobs
          </Link>
        </div>

        <p className="mt-10 text-xs text-slate-500">
          Need help? <Link href="/contact" className="text-[#facc15] hover:underline">Contact us</Link>
        </p>
      </div>
    </div>
  )
}