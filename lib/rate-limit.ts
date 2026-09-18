// Simple in-memory rate limiter.
// Key = unique identifier (usually IP). Resets after windowMs.

type Entry = {
  count: number
  resetAt: number
}

const store = new Map<string, Entry>()

// Cleanup old entries every 5 minutes so memory doesn't grow forever
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of store.entries()) {
      if (entry.resetAt < now) store.delete(key)
    }
  }, 5 * 60 * 1000)
}

export type RateLimitResult = {
  ok: boolean
  remaining: number
  resetAt: number
  retryAfterSeconds: number
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now()
  const entry = store.get(key)

  // New window or expired entry
  if (!entry || entry.resetAt < now) {
    const resetAt = now + windowMs
    store.set(key, { count: 1, resetAt })
    return {
      ok: true,
      remaining: limit - 1,
      resetAt,
      retryAfterSeconds: Math.ceil(windowMs / 1000),
    }
  }

  // Still in window
  entry.count += 1
  const ok = entry.count <= limit

  return {
    ok,
    remaining: Math.max(0, limit - entry.count),
    resetAt: entry.resetAt,
    retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000),
  }
}

/**
 * Extracts the client's IP from the request headers.
 * On Vercel/proxies, x-forwarded-for is set. Falls back to a generic key.
 */
export function getClientIp(request: Request): string {
  const xff = request.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  return request.headers.get('x-real-ip') || 'unknown'
}