export default function TeamPage() {
  const team = [
    { name: 'Sarah Jenkins', role: 'CEO & Founder', desc: 'Former VP of Talent at a Fortune 500 company.' },
    { name: 'David Chen', role: 'Head of Recruitment', desc: '10+ years matching senior technical talent with YC-backed startups.' },
    { name: 'Elena Rodriguez', role: 'Sourcing Director', desc: 'Expert in Boolean search and discovering hidden gems.' },
    { name: 'Michael Chang', role: 'Client Success Manager', desc: 'Ensuring seamless communication for our enterprise clients.' }
  ];

  return (
    <div className="container" style={{ padding: '60px 0' }}>
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 48px auto' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '12px' }}>Meet Our Team</h1>
        <p style={{ color: '#6b7280', fontSize: '18px' }}>The global talent experts dedicated to finding your next great hire.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
        {team.map((member, i) => (
          <div key={i} style={{ background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div style={{ height: '200px', background: '#e5e7eb' }}></div>
            <div style={{ padding: '16px' }}>
              <h3 style={{ fontWeight: 'bold' }}>{member.name}</h3>
              <p style={{ color: '#2563eb', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>{member.role}</p>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>{member.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}