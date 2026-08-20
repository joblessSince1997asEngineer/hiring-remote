import { FileText, Search, ShieldCheck, Briefcase } from 'lucide-react'

export default function ProcessPage() {
  const steps = [
    { icon: <FileText size={28} />, title: 'Company Submits Requirements', desc: 'You provide detailed information about the role, required skills, company culture, and compensation.' },
    { icon: <Search size={28} />, title: 'Sourcing & Outreach', desc: 'Our recruitment team leverages global networks, specialized communities, and direct sourcing to find top talent.' },
    { icon: <ShieldCheck size={28} />, title: 'Curated Vetting', desc: 'We conduct rigorous technical assessments, behavioral interviews, and reference checks to ensure top quality.' },
    { icon: <Briefcase size={28} />, title: 'Offer & Onboarding', desc: 'We help coordinate the offer process and facilitate a seamless onboarding experience across different time zones.' },
  ]

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '60px 20px', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: '40px', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>How We Hire</h1>
          <p style={{ color: '#64748b', fontSize: '18px' }}>A refined, proven four-step methodology that guarantees you only meet the top 1% of global talent.</p>
        </div>

        {/* Timeline */}
        <div style={{ position: 'relative', marginLeft: '20px', paddingLeft: '40px', borderLeft: '2px solid #e2e8f0' }}>
          {steps.map((step, index) => (
            <div key={index} style={{ marginBottom: '48px', position: 'relative' }}>
              
              {/* Yellow Circle Icon */}
              <div style={{
                position: 'absolute', left: '-50px', top: '0',
                width: '48px', height: '48px', borderRadius: '50%',
                backgroundColor: '#fffbeb', border: '2px solid #f59e0b',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#f59e0b'
              }}>
                {step.icon}
              </div>

              {/* Card */}
              <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px' }}>
                <div style={{ color: '#f59e0b', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', marginBottom: '4px' }}>
                  STEP {String(index + 1).padStart(2, '0')}
                </div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>{step.title}</h3>
                <p style={{ margin: 0, color: '#475569', fontSize: '14px', lineHeight: '1.6' }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}