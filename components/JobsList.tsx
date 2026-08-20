'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, MapPin, Bookmark } from 'lucide-react'

export default function JobsList({ initialJobs }: { initialJobs: any[] }) {
  const [jobs, setJobs] = useState(initialJobs)
  const [searchTerm, setSearchTerm] = useState('')
  const [region, setRegion] = useState('')

  const handleSearch = () => {
    const filtered = initialJobs.filter((job) => {
      const matchesSearch = 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRegion = region === '' || job.location === region
      return matchesSearch && matchesRegion
    })
    setJobs(filtered)
  }

  return (
    <div>
      {/* Dark Hero */}
      <div style={{ backgroundColor: '#0f172a', color: 'white', padding: '60px 20px 80px', borderBottomLeftRadius: '40px', borderBottomRightRadius: '40px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '12px' }}>Find Your Next Remote Role</h1>
          <p style={{ fontSize: '18px', color: '#94a3b8', marginBottom: '32px' }}>Join the world's best companies. Work from anywhere.</p>
          <div style={{ backgroundColor: 'white', padding: '12px', borderRadius: '16px', display: 'flex', gap: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px', padding: '0 12px', borderRight: '1px solid #e2e8f0' }}>
              <Search color="#94a3b8" size={20} />
              <input type="text" placeholder="Job title, keywords, or company" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ border: 'none', outline: 'none', width: '100%', fontSize: '16px', color: '#1e293b' }} />
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px', padding: '0 12px' }}>
              <MapPin color="#94a3b8" size={20} />
             <select 
  value={region} 
  onChange={(e) => setRegion(e.target.value)} 
  style={{ 
    border: 'none', 
    outline: 'none', 
    width: '100%', 
    fontSize: '16px', 
    backgroundColor: 'white',
    color: '#1e293b', // <--- THIS FIXES THE INVISIBLE TEXT
    cursor: 'pointer',
    appearance: 'auto',
    padding: '4px 0'
  }}
>
  <option value="">Any Region</option>
  <option value="Worldwide">Worldwide</option>
  <option value="USA">USA</option>
  <option value="UK">UK</option>
  <option value="EMEA">EMEA</option>
  <option value="APAC">APAC</option>
</select>
            </div>
            <button onClick={handleSearch} style={{ backgroundColor: 'black', color: 'white', border: 'none', padding: '12px 32px', borderRadius: '9999px', fontWeight: '600', fontSize: '16px', cursor: 'pointer' }}>Search Jobs</button>
          </div>
        </div>
      </div>

      {/* Job List */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 20px' }}>
        <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <div style={{ backgroundColor: '#f59e0b', color: 'white', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>✓</div>
          <div><h4 style={{ margin: 0, color: '#0f172a' }}>Curated Quality Guarantee</h4><p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#475569' }}>Every job listed on this platform has been manually vetted and added by our team.</p></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '40px' }}>
          <div>
            <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}><h4 style={{ margin: 0, fontSize: '18px' }}>Filters</h4><span style={{ fontSize: '14px', color: '#64748b', cursor: 'pointer', fontWeight: '500' }} onClick={() => { setSearchTerm(''); setRegion(''); setJobs(initialJobs); }}>Clear all</span></div>
              <div><h5 style={{ margin: '0 0 12px 0', fontSize: '14px' }}>Job Type</h5>{['Full-time', 'Contract', 'Part-time', 'Freelance'].map(type => (<label key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '14px', color: '#475569', cursor: 'pointer' }}><input type="checkbox" style={{ width: '16px', height: '16px' }} /> {type}</label>))}</div>
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}><h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>{jobs.length} Jobs Found</h3><select style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px' }}><option>Most Recent</option></select></div>
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <div key={job.id} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <div style={{ width: '48px', height: '48px', backgroundColor: '#e2e8f0', borderRadius: '8px' }}></div>
                      <div><h4 style={{ margin: '0 0 4px 0', fontSize: '18px' }}>{job.title}</h4><p style={{ margin: '0 0 12px 0', color: '#64748b', fontSize: '14px' }}>{job.company} • {job.location}</p><p style={{ margin: '0 0 12px 0', color: '#475569', fontSize: '14px', maxWidth: '450px' }}>{job.description}</p>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>🌐 {job.location}</span>
                          <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>💼 {job.type}</span>
                          {job.salaryMin && job.salaryMax && (<span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>💰 ${job.salaryMin}k - ${job.salaryMax}k</span>)}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><Bookmark color="#64748b" size={20} /></button>
                      <Link href={`/jobs/${job.id}`}><button style={{ border: '1px solid #e2e8f0', background: 'white', color: '#0f172a', padding: '10px 20px', borderRadius: '9999px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>Apply Now</button></Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}><p style={{ color: '#64748b' }}>No jobs found. Try adjusting your filters.</p></div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}