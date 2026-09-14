'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import AuthButtons from '@/components/AuthButtons'
import MobileNavbar from '@/components/MobileNavbar'
import NavLinks from '@/components/NavLinks'
import Footer from '@/components/Footer'

export default function ConditionalChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Hide Navbar and Footer for any page inside the dashboard
  const isDashboard = pathname.startsWith('/dashboard')

  if (isDashboard) {
    return <>{children}</>
  }

  return (
    <>
      <nav className="relative flex items-center justify-between p-4 md:px-10 border-b border-slate-200 bg-white">
        <Link href="/" className="flex flex-col items-start no-underline shrink-0 max-w-[160px] md:max-w-none">
          <img src="/logo.png" alt="Remote Hirring" className="h-10 w-auto object-contain" />
          <span className="hidden sm:block text-[10px] text-slate-700 font-normal">
            Great recruitment starts with a conversation
          </span>
        </Link>

        <div className="hidden md:flex gap-8 items-center">
          <NavLinks />
        </div>

        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <AuthButtons />
          <MobileNavbar />
        </div>
      </nav>

      {children}

      <Footer />
    </>
  )
}