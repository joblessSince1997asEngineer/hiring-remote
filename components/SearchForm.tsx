'use client'
import { useRouter, useSearchParams } from 'next/navigation'

export function SearchForm() {
  const router = useRouter()
  const params = useSearchParams()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const search = formData.get('search') || ''
    const location = formData.get('location') || ''
    const type = formData.get('type') || ''
    router.push(`/?search=${search}&location=${location}&type=${type}`)
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <input 
        name="search" 
        defaultValue={params.get('search') || ''} 
        placeholder="Job title, keywords..." 
        style={{ padding: '12px', flex: 1, border: '1px solid #d1d5db', borderRadius: '6px' }} 
      />
      <select name="location" defaultValue={params.get('location') || ''} style={{ padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px' }}>
        <option value="">Anywhere</option>
        <option value="Worldwide">Worldwide</option>
        <option value="USA">USA</option>
      </select>
      <select name="type" defaultValue={params.get('type') || ''} style={{ padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px' }}>
        <option value="">All Types</option>
        <option value="Full-time">Full-time</option>
        <option value="Contract">Contract</option>
      </select>
      <button type="submit" style={{ padding: '12px 24px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
        Search
      </button>
    </form>
  )
}