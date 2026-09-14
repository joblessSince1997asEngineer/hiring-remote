'use client'
import Link from 'next/link'
import { useState } from 'react'
import { ArrowUp } from 'lucide-react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    setSubscribed(true)
    setEmail('')
  }

  return (
    <footer className="bg-[#0f172a] text-white">
      {/* Newsletter Section */}
      <div className="max-w-6xl mx-auto px-6 py-12 border-b border-slate-700/50">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-left w-full md:w-auto">
            <h3 className="text-2xl font-bold mb-2">Stay ahead in global hiring</h3>
            <p className="text-slate-400">Get the latest insights and top remote talent in your inbox.</p>
          </div>
          <form onSubmit={handleSubscribe} className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full sm:w-72 px-4 py-3 rounded-full bg-slate-800 text-white placeholder-slate-400 border border-slate-700 focus:outline-none focus:border-yellow-400"
            />
            <button type="submit" className="bg-[#facc15] text-black px-6 py-3 rounded-full font-semibold hover:bg-yellow-300 transition-colors">
              {subscribed ? 'Subscribed ✓' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Column 1: Brand & Mission */}
        <div className="text-left">
          {/* FIXED: Logo width set to fixed size so it doesn't stretch on mobile */}
          <div className="flex flex-col items-start mb-4">
            <img src="/logo.png" alt="Remote Hirring" className="w-36 h-auto object-contain mb-2" />
            <span className="text-[10px] text-slate-400">Great recruitment starts with a conversation</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Connecting the world's top 1% of remote professionals with high-growth companies.
          </p>
          {/* FIXED: Added items-center for proper icon alignment */}
          <div className="flex items-center gap-4">
            <a href="#" aria-label="LinkedIn" className="hover:text-[#facc15] transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7.5 0h3.8v2.2h.1c.5-1 1.8-2.2 3.8-2.2 4 0 4.8 2.6 4.8 6V24h-4v-8.5c0-2-.04-4.6-2.8-4.6-2.8 0-3.2 2.2-3.2 4.5V24h-4V8z"/></svg>
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-[#facc15] transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 4.9c-.8.4-1.7.6-2.6.8.9-.5 1.6-1.4 2-2.4-.9.5-1.9.9-2.9 1.1C18.7 3.6 17.5 3 16.2 3c-2.5 0-4.5 2-4.5 4.5 0 .4 0 .7.1 1.1C7.7 8.4 4.5 6.6 2.3 3.9c-.4.7-.6 1.5-.6 2.3 0 1.6.8 2.9 2 3.7-.7 0-1.4-.2-2-.5v.1c0 2.2 1.6 4 3.6 4.4-.4.1-.8.2-1.2.2-.3 0-.6 0-.9-.1.6 1.8 2.3 3.2 4.3 3.2-1.6 1.2-3.5 2-5.6 2-.4 0-.7 0-1.1-.1 2 1.3 4.4 2 7 2 8.4 0 13-7 13-13v-.6c.9-.6 1.6-1.4 2.2-2.3z"/></svg>
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-[#facc15] transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c-2.7 0-3 0-4 .1-1 .1-1.7.2-2.4.5-.7.3-1.2.6-1.7 1.1-.5.5-.8 1-1.1 1.7-.3.7-.4 1.4-.5 2.4C.1 9 0 9.3 0 12s.1 3 .1 4c.1 1 .2 1.7.5 2.4.3.7.6 1.2 1.1 1.7.5.5 1 .8 1.7 1.1.7.3 1.4.4 2.4.5 1 .1 1.3.1 4 .1s3 0 4-.1c1-.1 1.7-.2 2.4-.5.7-.3 1.2-.6 1.7-1.1.5-.5.8-1 1.1-1.7.3-.7.4-1.4.5-2.4.1-1 .1-1.3.1-4s0-3-.1-4c-.1-1-.2-1.7-.5-2.4-.3-.7-.6-1.2-1.1-1.7-.5-.5-1-.8-1.7-1.1-.7-.3-1.4-.4-2.4-.5-1-.1-1.3-.1-4-.1zm0 5c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3zm5.5-8.3c0 .7-.5 1.2-1.2 1.2-.7 0-1.2-.5-1.2-1.2s.5-1.2 1.2-1.2 1.2.5 1.2 1.2z"/></svg>
            </a>
          </div>
        </div>

        {/* Column 2: Company Links */}
        <div className="text-left">
          <h4 className="text-lg font-semibold mb-4">Company</h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li><Link href="/about" className="hover:text-[#facc15] transition-colors">About Us</Link></li>
            <li><Link href="/team" className="hover:text-[#facc15] transition-colors">Meet The Team</Link></li>
            <li><Link href="/process" className="hover:text-[#facc15] transition-colors">Our Process</Link></li>
            <li><Link href="/pricing" className="hover:text-[#facc15] transition-colors">Our Fee Structure</Link></li>
          </ul>
        </div>

        {/* Column 3: Services */}
        <div className="text-left">
          <h4 className="text-lg font-semibold mb-4">Services</h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li>Candidate Sourcing</li>
            <li>Candidate Screening</li>
            <li>Interview Coordination</li>
            <li>Global Remote Recruitment</li>
          </ul>
        </div>

        {/* Column 4: Resources & Support */}
        <div className="text-left">
          <h4 className="text-lg font-semibold mb-4">Resources & Support</h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li><Link href="/jobs" className="hover:text-[#facc15] transition-colors">Browse Jobs</Link></li>
            <li><Link href="/dashboard/post" className="hover:text-[#facc15] transition-colors">Post a Job</Link></li>
            <li><Link href="/contact" className="hover:text-[#facc15] transition-colors">Contact Us</Link></li>
            <li><Link href="/forgot-password" className="hover:text-[#facc15] transition-colors">Forgot Password</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar: Legal & Copyright */}
      <div className="border-t border-slate-700/50">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© 2026 Remote Hirring. All rights reserved.</p>
                    <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-[#facc15] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#facc15] transition-colors">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-[#facc15] transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 bg-[#facc15] text-black p-3 rounded-full shadow-lg hover:bg-yellow-300 transition-colors z-50"
        aria-label="Back to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </footer>
  )
}