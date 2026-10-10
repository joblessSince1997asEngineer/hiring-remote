import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Remote Hirring connects global companies with elite remote professionals. Our story, mission, and team.',
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}