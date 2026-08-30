'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function InvoicePage() {
  const searchParams = useSearchParams()
  const jobId = searchParams.get('jobId')

  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchInvoice() {
      if (!jobId) return
      const res = await fetch(`/api/invoice?jobId=${jobId}`)
      const json = await res.json()
      if (res.ok) setData(json)
      setLoading(false)
    }
    fetchInvoice()
  }, [jobId])

  if (loading) return <div className="p-8">Loading invoice...</div>
  if (!data) return <div className="p-8 text-red-500">Invoice not found.</div>

  const { application, job } = data

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-8 flex justify-center">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm max-w-2xl w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Invoice</h1>
            <p className="text-slate-500">RemoteHiring Agency</p>
          </div>
          <div className="text-right">
            <p className="text-slate-500">Date: {new Date(application.appliedAt).toLocaleDateString()}</p>
            <p className="text-slate-500">Invoice #: {application.id.slice(-6)}</p>
          </div>
        </div>

        <div className="border-t border-b border-slate-200 py-4 mb-4">
          <h2 className="text-lg font-bold text-slate-800">Bill To:</h2>
          <p className="text-slate-600">{job?.company}</p>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-2">Job Details:</h2>
          <p className="text-slate-600">Role: {job?.title}</p>
          <p className="text-slate-600">Location: {job?.location}</p>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg">
          <div className="flex justify-between">
            <span className="font-medium">Placement Fee (40%)</span>
            <span className="font-bold text-slate-900">${application.placement_fee}</span>
          </div>
        </div>

        <div className="mt-8 text-right">
          <p className="text-slate-500">Total Due:</p>
          <p className="text-3xl font-bold text-slate-900">${application.placement_fee}</p>
        </div>

        <button onClick={() => window.print()} className="mt-8 w-full bg-black text-white py-3 rounded-full font-bold">
          Print Invoice
        </button>
      </div>
    </div>
  )
}