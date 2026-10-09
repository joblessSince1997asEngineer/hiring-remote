import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

export type RateLimitResult = {
  ok: boolean
  remaining: number
  resetAt: number
  retryAfterSeconds: number
}

/**
 * Postgres-backed rate limiter.
 * Works across all serverless instances — no in-memory state.
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const now = Date.now()
  const windowStart = new Date(now - windowMs)

  const [count, oldest] = await Promise.all([
    prisma.rateLimit.count({
      where: { key, createdAt: { gte: windowStart } },
    }),
    prisma.rateLimit.findFirst({
      where: { key, createdAt: { gte: windowStart } },
      orderBy: { createdAt: 'asc' },
      select: { createdAt: true },
    }),
  ])

  const resetAt = oldest
    ? oldest.createdAt.getTime() + windowMs
    : now + windowMs

  if (count >= limit) {
    return {
      ok: false,
      remaining: 0,
      resetAt,
      retryAfterSeconds: Math.max(1, Math.ceil((resetAt - now) / 1000)),
    }
  }

  const [action, ...rest] = key.split(':')
  const ip = rest.join(':') || 'unknown'

  await prisma.rateLimit.create({
    data: { key, action, ip },
  })

  return {
    ok: true,
    remaining: limit - count - 1,
    resetAt,
    retryAfterSeconds: Math.ceil(windowMs / 1000),
  }
}

/**
 * Preset limits per action.
 */
export const LIMITS = {
  signup:          { limit: 5,   windowMs: 60 * 60 * 1000 },
  login:           { limit: 10,  windowMs: 15 * 60 * 1000 },
  passwordReset:   { limit: 3,   windowMs: 60 * 60 * 1000 },
  contact:         { limit: 5,   windowMs: 60 * 60 * 1000 },
  api:             { limit: 100, windowMs: 60 * 1000 },
  screeningUpload: { limit: 20,  windowMs: 60 * 60 * 1000 },
} as const

/**
 * Enforce a preset. Returns a 429 Response if blocked, null if allowed.
 */
export async function enforceRateLimit(
  action: keyof typeof LIMITS,
  ip: string
): Promise<Response | null> {
  const { limit, windowMs } = LIMITS[action]
  const result = await rateLimit(`${action}:${ip}`, limit, windowMs)

  if (!result.ok) {
    return new Response(
      JSON.stringify({ error: 'Too many requests. Please try again later.' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(result.retryAfterSeconds),
          'X-RateLimit-Limit': String(limit),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.floor(result.resetAt / 1000)),
        },
      }
    )
  }
  return null
}

/**
 * Extracts client IP from a Request object.
 */
export function getClientIp(request: Request): string {
  const xff = request.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  return request.headers.get('x-real-ip') || 'unknown'
}

/**
 * Extracts client IP from Next.js headers() context (Server Actions).
 */
export async function getClientIpFromHeaders(): Promise<string> {
  const h = await headers()
  const xff = h.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  return h.get('x-real-ip') || 'unknown'
}

/**
 * Cleanup old entries. Call from a cron.
 */
export async function cleanupRateLimits() {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000)
  await prisma.rateLimit.deleteMany({ where: { createdAt: { lt: cutoff } } })
}