import './globals.css'
import Link from 'next/link'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Navigation Bar */}
        <nav className="navbar">
          <Link href="/" style={{fontSize: '20px', fontWeight: 'bold', color: '#0f172a'}}>
            HiringRemote
          </Link>
          <div className="nav-links">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/services">Services</Link>
            <Link href="/process">Process</Link>
            <Link href="/team">Team</Link>
          </div>
          <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
            <Link href="/sign-up" style={{fontSize: '14px', fontWeight: '500'}}>Log In</Link>
            <Link href="/dashboard/post">
              <button className="nav-btn">Hire Talent</button>
            </Link>
          </div>
        </nav>

        {children}
      </body>
    </html>
  )
}