import crypto from 'crypto'

function getSecret(): string {
  const secret = process.env.SESSION_SECRET
  if (!secret) {
    throw new Error('SESSION_SECRET is not configured')
  }
  return secret
}
/**
 * Creates a signed token: userId.signature
 * The signature is an HMAC of the userId using SESSION_SECRET.
 */
export function signSession(userId: string): string {
  const signature = crypto
        .createHmac('sha256', getSecret())
    .update(userId)
    .digest('base64url')
  return `${userId}.${signature}`
}

/**
 * Verifies a signed token.
 * Returns the userId if valid, null if tampered/malformed.
 * Uses constant-time comparison to prevent timing attacks.
 */
export function verifySession(token: string | undefined): string | null {
  if (!token) return null
  const parts = token.split('.')
  if (parts.length !== 2) return null
  const [userId, signature] = parts
  if (!userId || !signature) return null

  const expected = crypto
        .createHmac('sha256', getSecret())
    .update(userId)
    .digest('base64url')

  const a = Buffer.from(signature)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return null
  if (!crypto.timingSafeEqual(a, b)) return null

  return userId
}