export default function ProcessPage() {
  return (
    <div className="container" style={{ padding: '60px 0' }}>
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 48px auto' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '12px' }}>How It Works</h1>
        <p style={{ color: '#6b7280', fontSize: '18px' }}>
          A streamlined, transparent process designed to find your perfect hire in under 14 days.
        </p>
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        {[
          { step: '01', title: 'Client Shares Requirements', desc: 'We start with a deep dive into your technical needs, team culture, and business goals to understand exactly who you need.' },
          { step: '02', title: 'Talent Sourcing', desc: 'Our sourcing team leverages our global network and proprietary database to identify the top 1% of remote talent worldwide.' },
          { step: '03', title: 'Vetting & Screening', desc: 'We conduct rigorous technical assessments, behavioral interviews, and background checks to ensure every candidate is a perfect fit.' },
          { step: '04', title: 'Offer & Onboarding', desc: 'We facilitate a seamless offer process and handle the global onboarding.' }
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '24px', marginBottom: '32px', paddingLeft: '24px', borderLeft: '2px solid #e5e7eb' }}>
            <div style={{ minWidth: '48px', height: '48px', borderRadius: '50%', background: '#eff6ff', border: '2px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#2563eb' }}>
              {item.step}
            </div>
            <div style={{ background: 'white', padding: '20px 24px', borderRadius: '12px', border: '1px solid #e5e7eb', flex: '1' }}>
              <h3 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '4px' }}>{item.title}</h3>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}