import { Search, ShieldCheck, Calendar } from 'lucide-react'

export default function ServicesPage() {
  const services = [
    { icon: <Search size={32} color="#0f172a" />, title: 'Candidate Sourcing', desc: 'We leverage deep networks, proprietary databases, and targeted outreach to find passive talent that perfectly matches your requirements.' },
    { icon: <ShieldCheck size={32} color="#0f172a" />, title: 'Candidate Screening', desc: 'Our rigorous multi-stage screening process includes technical assessments, behavioral interviews, and reference checks.' },
    { icon: <Calendar size={32} color="#0f172a" />, title: 'Interview Coordination', desc: 'We handle all scheduling logistics across time zones, ensuring a smooth and professional experience for both you and the candidate.' },
  ]

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '60px 20px', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: '40px', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>Our Services</h1>
          <p style={{ color: '#64748b', fontSize: '18px' }}>Comprehensive remote recruitment solutions designed to help you build elite global teams quickly and efficiently.</p>
        </div>

        {/* Service Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {services.map((service, index) => (
            <div key={index} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '32px' }}>
              {/* Icon Container */}
              <div style={{ width: '64px', height: '64px', backgroundColor: '#f1f5f9', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                {service.icon}
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: '0 0 8px 0' }}>{service.title}</h3>
              <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.5', margin: '0 0 16px 0' }}>{service.desc}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '500', fontSize: '14px', cursor: 'pointer' }}>
                Learn more <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}