export default function AboutPage() {
  return (
    <div className="container" style={{ padding: '60px 0' }}>
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 40px auto' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '12px' }}>About Hiring Remote</h1>
        <p style={{ color: '#6b7280', fontSize: '18px', lineHeight: '1.6' }}>
          We are on a mission to democratize access to global opportunities, connecting exceptional companies with world-class talent, regardless of geography.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '16px' }}>Our Story</h2>
          <p style={{ color: '#4b5563', marginBottom: '16px', lineHeight: '1.6' }}>
            Founded in 2023, Hiring Remote started with a simple observation: talent is distributed equally around the world, but opportunity is not.
          </p>
          <p style={{ color: '#4b5563', lineHeight: '1.6' }}>
            We saw startups struggling to hire locally due to fierce competition, while brilliant engineers and professionals in emerging markets lacked access to these opportunities.
          </p>
        </div>
        <div style={{ backgroundColor: '#e5e7eb', height: '300px', borderRadius: '16px' }}></div>
      </div>
    </div>
  )
}