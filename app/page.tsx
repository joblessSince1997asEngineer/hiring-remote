import Link from 'next/link'

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', textAlign: 'center' }}>
      
      {/* Badge */}
      <div style={{ display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#94a3b8', padding: '8px 16px', borderRadius: '9999px', fontSize: '12px', fontWeight: '600', letterSpacing: '1px', marginBottom: '24px' }}>
        GLOBAL REACH • ELITE TALENT
      </div>

      {/* Main Headline */}
      <h1 style={{ fontSize: '56px', fontWeight: '800', lineHeight: '1.1', marginBottom: '24px', color: 'white' }}>
        Hire Top Remote <br />
        <span style={{ color: '#3b82f6' }}>Talent Worldwide.</span>
      </h1>

      {/* Subtext */}
      <p style={{ fontSize: '18px', color: '#94a3b8', maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.6' }}>
        Empowering startups and enterprises to build high-performing distributed teams. We source, screen, and vet the world's top 1% of remote professionals for you.
      </p>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
        <Link href="/dashboard/post">
          <button style={{ backgroundColor: 'black', color: 'white', border: '2px solid black', padding: '14px 32px', borderRadius: '9999px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
            Hire Talent
          </button>
        </Link>
        <Link href="/jobs">
          <button style={{ backgroundColor: 'transparent', color: 'white', border: '1px solid #334155', padding: '14px 32px', borderRadius: '9999px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
            Browse Jobs
          </button>
        </Link>
      </div>

    </div>
  )
}