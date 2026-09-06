import Link from 'next/link'
import './globals.css'
import PrivateNavbar from '@/components/PrivateNavbar'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: 'Inter, system-ui, sans-serif', backgroundColor: '#f8fafc', color: '#1e293b' }}>
        
        {/* NAVIGATION BAR */}
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 40px', borderBottom: '1px solid #e2e8f0', background: 'white' }}>
          <Link href="/" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textDecoration: 'none', lineHeight: '1.2' }}>
  <img src="/logo.png" alt="Remote Hirring" style={{ height: '45px', width: 'auto', marginBottom: '4px' }} />
  <span style={{ fontSize: '11px', color: '#1e293b', fontWeight: '400' }}>
    Great recruitment starts with a conversation
  </span>
</Link>

          <div style={{ display: 'flex', gap: '32px', fontSize: '14px', fontWeight: '500', color: '#64748b' }}>
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
            <Link href="/services" style={{ textDecoration: 'none', color: 'inherit' }}>Services</Link>
            <Link href="/process" style={{ textDecoration: 'none', color: 'inherit' }}>Process</Link>
            <Link href="/team" style={{ textDecoration: 'none', color: 'inherit' }}>Team</Link>
            <Link href="/jobs" style={{ textDecoration: 'none', color: 'inherit' }}>Jobs</Link>
            <Link href="/pricing" style={{ textDecoration: 'none', color: 'inherit' }}>Our Fee Structure</Link>
            <Link href="/about" style={{ textDecoration: 'none', color: 'inherit' }}>About</Link>
            
          </div>

                             <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* This automatically shows Admin/Client/Founder ONLY if the user has the right role */}
            <PrivateNavbar />

            {/* Public 'Log in' link for ALL users */}
            <Link href="/login" style={{ textDecoration: 'none', color: '#1e293b', fontSize: '14px', fontWeight: '500' }}>Log in</Link>

            <Link href="/sign-up">
              <button style={{ background: 'black', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '9999px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
                Get Started
              </button>
            </Link>
          </div>
        </nav>

        {children}
      </body>
    </html>
  )
}
