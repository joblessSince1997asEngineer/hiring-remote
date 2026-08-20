import Link from 'next/link'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: 'Inter, system-ui, sans-serif', backgroundColor: '#f8fafc', color: '#1e293b' }}>
        
        {/* NAVIGATION BAR */}
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 40px', borderBottom: '1px solid #e2e8f0', background: 'white' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'black' }}>
            {/* Yellow Lightning Icon */}
            <div style={{ width: '32px', height: '32px', backgroundColor: '#facc15', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" />
              </svg>
            </div>
            <span style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.5px' }}>REMOTE HIRING</span>
          </Link>

          <div style={{ display: 'flex', gap: '32px', fontSize: '14px', fontWeight: '500', color: '#64748b' }}>
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
            <Link href="/services" style={{ textDecoration: 'none', color: 'inherit' }}>Services</Link>
            <Link href="/process" style={{ textDecoration: 'none', color: 'inherit' }}>Process</Link>
            <Link href="/jobs" style={{ textDecoration: 'none', color: 'inherit' }}>Jobs</Link>
            <Link href="/pricing" style={{ textDecoration: 'none', color: 'inherit' }}>Our Fee Structure</Link>
            <Link href="/about" style={{ textDecoration: 'none', color: 'inherit' }}>About</Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ color: '#94a3b8', cursor: 'pointer' }}>🌙</span>
            <Link href="/login" style={{ textDecoration: 'none', color: '#1e293b', fontSize: '14px', fontWeight: '500' }}>Log in</Link>
            <Link href="/dashboard/post">
              <button style={{ background: 'black', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '9999px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
                Hire Talent
              </button>
            </Link>
          </div>
        </nav>

        {children}
      </body>
    </html>
  )
}