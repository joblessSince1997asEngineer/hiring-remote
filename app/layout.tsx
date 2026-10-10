import type { Metadata } from 'next'
import './globals.css'
import ConditionalChrome from '@/components/ConditionalChrome'
import { Toaster } from 'sonner'

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://hiring-remote.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Remote Hirring — Hire Top Remote Talent Worldwide',
    template: '%s | Remote Hirring',
  },
  description:
    'Remote Hirring connects startups and enterprises with the top 1% of global remote talent. Fast screening, verified candidates, transparent pricing.',
  keywords: [
    'remote hiring',
    'remote recruitment',
    'hire remote developers',
    'global talent',
    'remote jobs',
    'technical screening',
  ],
  authors: [{ name: 'Remote Hirring' }],
  creator: 'Remote Hirring',
  publisher: 'Remote Hirring',
  applicationName: 'Remote Hirring',

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Remote Hirring',
    title: 'Remote Hirring — Hire Top Remote Talent Worldwide',
    description:
      'Connect with the top 1% of global remote talent. Fast screening, verified candidates, transparent pricing.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Remote Hirring',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Remote Hirring — Hire Top Remote Talent Worldwide',
    description:
      'Connect with the top 1% of global remote talent. Fast screening, verified candidates.',
    images: ['/logo.png'],
  },

  icons: {
    icon: '/favicon.ico',
    apple: '/logo.png',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: 'Inter, system-ui, sans-serif', backgroundColor: '#f8fafc', color: '#1e293b' }}>
        <ConditionalChrome>
          {children}
        </ConditionalChrome>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  )
}