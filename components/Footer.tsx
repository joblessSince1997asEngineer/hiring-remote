'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

export default function Footer() {
    const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll() // initial check
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error('failed')
      setStatus('ok')
      setEmail('')
      setTimeout(() => setStatus('idle'), 3000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <footer className="bg-[#0f172a] text-white">
      {/* Newsletter Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 border-b border-slate-700/50">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-left w-full md:w-auto">
            <h3 className="text-2xl font-bold mb-2">Stay ahead in global hiring</h3>
            <p className="text-slate-300">Get the latest insights and top remote talent in your inbox.</p>
          </div>
          <form onSubmit={handleSubscribe} className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={status === 'loading'}
              className="w-full sm:w-72 px-4 py-3 rounded-full bg-slate-800 text-white placeholder-slate-400 border border-slate-700 focus:outline-none focus:border-yellow-400 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-[#facc15] text-black px-6 py-3 rounded-full font-semibold hover:bg-yellow-300 transition-colors disabled:opacity-60 min-w-[130px]"
            >
              {status === 'loading' && 'Sending…'}
              {status === 'ok' && 'Subscribed ✓'}
              {status === 'error' && 'Try again'}
              {status === 'idle' && 'Subscribe'}
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Column 1: Brand & Mission */}
        <div className="text-left">
          <div className="flex flex-col items-start mb-4">
            <img src="/logo.png" alt="Remote Hirring" className="w-36 h-auto object-contain mb-2" />
            <span className="text-[11px] text-slate-400">Great recruitment starts with a conversation</span>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            Connecting the world's top 1% of remote professionals with high-growth companies.
          </p>
          <div className="flex items-center gap-3 flex-wrap">
  {/* WhatsApp Channel */}
  <a
    href="https://whatsapp.com/channel/0029Vb7lJr0AzNbu94V63a0y"
    target="_blank"
    rel="noreferrer"
    aria-label="WhatsApp Channel"
    className="text-slate-300 hover:text-[#facc15] transition-colors"
  >
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  </a>

  {/* LinkedIn */}
  <a
    href="https://www.linkedin.com/company/remote-hirring"
    target="_blank"
    rel="noreferrer"
    aria-label="LinkedIn"
    className="text-slate-300 hover:text-[#facc15] transition-colors"
  >
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7.5 0h3.8v2.2h.1c.5-1 1.8-2.2 3.8-2.2 4 0 4.8 2.6 4.8 6V24h-4v-8.5c0-2-.04-4.6-2.8-4.6-2.8 0-3.2 2.2-3.2 4.5V24h-4V8z"/>
    </svg>
  </a>

    {/* Facebook */}
  <a
    href="https://www.facebook.com/profile.php?id=61592344877537"
    target="_blank"
    rel="noreferrer"
    aria-label="Facebook"
    className="text-slate-300 hover:text-[#facc15] transition-colors"
  >
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.5-3.91 3.78-3.91 1.1 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22c4.78-.76 8.43-4.92 8.43-9.94z"/>
    </svg>
  </a>

    {/* Instagram */}
  <a
    href="https://www.instagram.com/remote_hirring_"
    target="_blank"
    rel="noreferrer"
    aria-label="Instagram"
    className="text-slate-300 hover:text-[#facc15] transition-colors"
  >
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
</a>

  {/* YouTube */}
  <a
    href="https://www.youtube.com/@remotehiring"
    target="_blank"
    rel="noreferrer"
    aria-label="YouTube"
    className="text-slate-300 hover:text-[#facc15] transition-colors"
  >
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  </a>
</div>
        </div>

        {/* Column 2: Company Links */}
        <div className="text-left">
          <h4 className="text-lg font-semibold mb-4">Company</h4>
          <ul className="space-y-3 text-sm text-slate-300">
            <li><Link href="/about" className="hover:text-[#facc15] transition-colors">About Us</Link></li>
            <li><Link href="/team" className="hover:text-[#facc15] transition-colors">Meet The Team</Link></li>
            <li><Link href="/process" className="hover:text-[#facc15] transition-colors">Our Process</Link></li>
            <li><Link href="/pricing" className="hover:text-[#facc15] transition-colors">Our Fee Structure</Link></li>
          </ul>
        </div>

        {/* Column 3: Services (NOW LINKS) */}
        <div className="text-left">
          <h4 className="text-lg font-semibold mb-4">Services</h4>
          <ul className="space-y-3 text-sm text-slate-300">
            <li><Link href="/services#candidate-sourcing" className="hover:text-[#facc15] transition-colors">Candidate Sourcing</Link></li>
            <li><Link href="/services#candidate-screening" className="hover:text-[#facc15] transition-colors">Candidate Screening</Link></li>
            <li><Link href="/services#interview-coordination" className="hover:text-[#facc15] transition-colors">Interview Coordination</Link></li>
            <li>Global Remote Recruitment</li>
          </ul>
        </div>

        {/* Column 4: Resources & Support */}
        <div className="text-left">
          <h4 className="text-lg font-semibold mb-4">Resources & Support</h4>
          <ul className="space-y-3 text-sm text-slate-300">
            <li><Link href="/jobs" className="hover:text-[#facc15] transition-colors">Browse Jobs</Link></li>
            <li><Link href="/request-job" className="hover:text-[#facc15] transition-colors">Start Hiring</Link></li>
            <li><Link href="/contact" className="hover:text-[#facc15] transition-colors">Contact Us</Link></li>
            <li><Link href="/forgot-password" className="hover:text-[#facc15] transition-colors">Forgot Password</Link></li>
          </ul>
        </div>
      </div>

            {/* Bottom Bar */}
      <div className="border-t border-slate-700/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p className="text-slate-200">© 2026 Remote Hirring. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-slate-200 hover:text-[#facc15] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-slate-200 hover:text-[#facc15] transition-colors">Terms of Service</Link>
            <Link href="/cookies" className="text-slate-200 hover:text-[#facc15] transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>

            {/* Back to Top Button — appears after scrolling */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-5 right-5 bg-[#facc15] text-black p-2.5 rounded-full shadow-lg hover:bg-yellow-300 transition-all duration-300 z-50 ${
          showBackToTop
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        aria-label="Back to top"
      >
        <ArrowUp className="w-4 h-4" />
      </button>
    </footer>
  )
}