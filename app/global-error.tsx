'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body style={{
        margin: 0,
        fontFamily: 'Inter, system-ui, sans-serif',
        backgroundColor: '#0f172a',
        color: '#fff',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}>
        <div style={{ maxWidth: '480px', textAlign: 'center' }}>
          <p style={{ fontSize: '64px', fontWeight: 900, color: '#facc15', margin: 0, lineHeight: 1 }}>
            Oops
          </p>
          <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '16px 0 8px' }}>
            Something went wrong
          </h1>
          <p style={{ color: '#cbd5e1', marginBottom: '24px' }}>
            An unexpected error occurred. Please try again.
          </p>
          <button
            onClick={reset}
            style={{
              background: '#facc15',
              color: '#0f172a',
              padding: '12px 24px',
              borderRadius: '9999px',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  )
}