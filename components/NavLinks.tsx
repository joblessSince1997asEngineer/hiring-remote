'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavLinks() {
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/process', label: 'Process' },
    { href: '/team', label: 'Team' },
    { href: '/jobs', label: 'Jobs' },
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
            className={`no-underline text-sm font-medium transition-colors ${
              isActive
                ? 'text-[#0f172a] font-bold'
                : 'text-slate-600 hover:text-[#0f172a]'
            }`}
          >
            {link.label}
          </Link>
        )
      })}
    </>
  )
}