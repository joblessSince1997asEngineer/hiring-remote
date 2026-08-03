export function JobCard({ job }: { job: any }) {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px', marginBottom: '16px', backgroundColor: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span style={{ backgroundColor: '#dcfce7', color: '#166534', fontSize: '12px', padding: '4px 8px', borderRadius: '9999px', fontWeight: 'bold' }}>
            {job.category || 'Engineering'}
          </span>
          <h3 style={{ margin: '10px 0 6px 0', fontSize: '18px', fontWeight: 'bold' }}>
            <a href={`/jobs/${job.id}`} style={{ textDecoration: 'none', color: '#111827' }}>{job.title}</a>
          </h3>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
            {job.company} • {job.location}
          </p>
        </div>
        <a href={`/jobs/${job.id}`} style={{ color: '#2563eb', fontWeight: '500', fontSize: '14px' }}>
          Apply Now →
        </a>
      </div>
    </div>
  );
}