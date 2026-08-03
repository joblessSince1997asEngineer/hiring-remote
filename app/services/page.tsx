export default function ServicesPage() {
  return (
    <div className="container" style={{ padding: '60px 0' }}>
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 48px auto' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '12px' }}>Our Services</h1>
        <p style={{ color: '#6b7280', fontSize: '18px' }}>
          Comprehensive remote recruitment solutions designed to scale your team with world-class talent, effortlessly.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        {[
          { title: 'Global Remote Recruitment', desc: 'We help you tap into a global talent pool, finding experts in every time zone to keep your business running 24/7.' },
          { title: 'Candidate Sourcing', desc: 'Our proprietary matching algorithms and expert recruiters identify top-tier candidates who align with your culture.' },
          { title: 'Candidate Screening', desc: 'Comprehensive vetting including technical assessments, behavioral interviews, and background checks.' }
        ].map((service, i) => (
          <div key={i} style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div style={{ width: '48px', height: '48px', background: '#eff6ff', borderRadius: '12px', marginBottom: '16px' }}></div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>{service.title}</h3>
            <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.5' }}>{service.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}