import Link from 'next/link'
import dynamic from 'next/dynamic'

// This disables Server-Side Rendering for the search bar completely.
const SearchForm = dynamic(() => import('@/components/SearchFormV2'), { 
  ssr: false 
})

export default function Home() {
  const jobs = [
    { id: '1', title: 'Senior Full Stack Engineer', company: 'TechCorp', location: 'Worldwide', type: 'Full-time', badge: 'Engineering' },
    { id: '2', title: 'Product Designer (UI/UX)', company: 'DesignHub', location: 'EMEA Timezone', type: 'Full-time', badge: 'Design' },
  ]

  return (
    <main>
      <section className="hero">
        <div className="container">
          <h1>Find your next big opportunity</h1>
          <p>Join top companies worldwide. Work from anywhere.</p>
          <div className="search-area">
            <SearchForm />
          </div>
        </div>
      </section>

      <section className="container job-section">
        <div className="job-header">
          <h2 style={{fontSize: '24px', fontWeight: 'bold'}}>Latest Remote Jobs</h2>
          <span style={{color: '#6b7280'}}>4 open roles</span>
        </div>

        {jobs.map((job) => (
          <div key={job.id} className="job-card">
            <div>
              <span className="job-badge">{job.badge}</span>
              <h3 className="job-title">{job.title}</h3>
              <p className="job-meta">{job.company} • {job.location} • {job.type}</p>
            </div>
            <Link href={`/jobs/${job.id}`} className="apply-link">Apply Now →</Link>
          </div>
        ))}
      </section>
    </main>
  )
}