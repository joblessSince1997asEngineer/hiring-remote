import './globals.css'
import ConditionalChrome from '@/components/ConditionalChrome'
import { Toaster } from 'sonner'

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