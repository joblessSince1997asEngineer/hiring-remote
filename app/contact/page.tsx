'use client'

import { toast } from 'sonner'
import { useState } from 'react'
import { Mail, MapPin } from 'lucide-react'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.target as HTMLFormElement)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.get('firstName'),
          lastName: formData.get('lastName'),
          email: formData.get('email'),
          company: formData.get('company'),
          message: formData.get('message'),
        }),
      })

      if (res.ok) {
        setSuccess(true)
        ;(e.target as HTMLFormElement).reset()
        setTimeout(() => setSuccess(false), 5000)
      } else {
        toast.error('Failed to send. Please try again.')
      }
    } catch (err) {
      toast.error('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0f172a] mb-4">Get in touch</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Ready to hire your next star employee? Have questions about our process? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left: Info */}
          <div>
            <h2 className="text-2xl font-bold text-[#0f172a] mb-4">Let's talk about your hiring needs</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Our global recruitment experts are ready to help you scale your team. Fill out the form, and we'll be in touch within 24 hours.
            </p>

            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-[#0f172a]">Email us</h3>
                <p className="text-sm text-slate-500">Our friendly team is here to help.</p>
                <p className="text-sm text-blue-600 font-medium">hello@hiringremote.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-[#0f172a]">Global HQ</h3>
                <p className="text-sm text-slate-500">We are a fully remote company.</p>
                <p className="text-sm text-slate-500">San Francisco, CA (Mailing Address)</p>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">First name</label>
                  <input name="firstName" required className="w-full p-3 border border-slate-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Last name</label>
                  <input name="lastName" required className="w-full p-3 border border-slate-300 rounded-lg text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Work email</label>
                <input name="email" type="email" required className="w-full p-3 border border-slate-300 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company name</label>
                <input name="company" required className="w-full p-3 border border-slate-300 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">How can we help?</label>
                <textarea name="message" rows={5} required className="w-full p-3 border border-slate-300 rounded-lg text-sm" />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3.5 rounded-full font-semibold hover:bg-slate-800 disabled:opacity-50"
              >
                {loading ? 'Sending...' : success ? 'Sent! We\'ll be in touch.' : 'Submit Inquiry'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}