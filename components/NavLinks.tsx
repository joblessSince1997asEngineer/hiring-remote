'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavLinks() {
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Home' },
    { href: '/jobs', label: 'Jobs' },
    { href: '/process', label: 'Process' },
    { href: '/services', label: 'Services' },
    { href: '/team', label: 'Team' },
    { href: '/pricing', label: 'Our Fee Structure' },
    { href: '/about', label: 'About' },
  ]

  return (
    <>
      {links.map((link) => {
        const isActive = pathname === link.href

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`no-underline text-sm transition-all border-b-[3px] pb-1 ${
              isActive
                ? 'text-[#0f172a] font-semibold border-transparent'
                : 'text-slate-600 font-medium hover:text-[#0f172a] hover:font-semibold border-transparent hover:border-[#0f172a]'
            }`}
          >
            {link.label}
          </Link>
        )
      })}
    </>
  )
}