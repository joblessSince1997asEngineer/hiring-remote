export default function AboutPage() {
  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '60px 20px', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: '40px', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>About Remote Hiring</h1>
          <p style={{ color: '#64748b', fontSize: '18px', maxWidth: '700px', margin: '0 auto' }}>
            We believe that talent is equally distributed globally, but opportunity is not. We're on a mission to bridge that gap.
          </p>
        </div>

        {/* Split Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', marginBottom: '16px' }}>Our Story</h2>
            <p style={{ color: '#475569', lineHeight: '1.6', marginBottom: '16px' }}>
              Founded in 2023, Remote Hiring was born out of a simple observation: companies were struggling to scale their engineering teams locally, while brilliant professionals around the world were looking for impactful work.
            </p>
            <p style={{ color: '#475569', lineHeight: '1.6', marginBottom: '16px' }}>
              We set out to build a platform and a service that removes the friction from global hiring. We handle the sourcing, the vetting, and the logistics, allowing companies to focus on building great products.
            </p>
            <p style={{ color: '#475569', lineHeight: '1.6' }}>
              Today, we are proud to partner with some of the most innovative startups and enterprise companies worldwide, helping them build high-performing distributed teams.
            </p>
          </div>
          
          {/* Right Side Image (Grayscale) */}
          <div style={{ height: '400px', borderRadius: '16px', overflow: 'hidden', backgroundColor: '#e2e8f0', filter: 'grayscale(100%)' }}>
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" 
              alt="Team working together" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
        </div>
      </div>
    </div>
  )
}