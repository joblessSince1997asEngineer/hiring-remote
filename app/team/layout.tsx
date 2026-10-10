import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Team',
  description:
    'Meet the team behind Remote Hirring — recruiters, engineers, and operators building global hiring.',
}

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}