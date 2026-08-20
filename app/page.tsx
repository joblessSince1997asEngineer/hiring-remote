'use client'

import { useState, useEffect } from 'react'
import JobsList from '@/components/JobsList'

export default function HomePage() {
  const [jobs, setJobs] = useState([])

  useEffect(() => {
    // Fetch real jobs inside the browser (Bypasses Vercel build error)
    async function loadJobs() {
      try {
        const res = await fetch('/api/jobs')
        const data = await res.json()
        setJobs(data.jobs || [])
      } catch (err) {
        console.error('Failed to fetch jobs:', err)
      }
    }
    loadJobs()
  }, [])

  return <JobsList initialJobs={jobs} />
}