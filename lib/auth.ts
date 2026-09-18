import { cookies } from 'next/headers'
import { verifySession } from './session'

/**
 * Reads the signed session cookie and returns the verified userId.
 * Returns null if the cookie is missing or tampered with.
 * Use this everywhere instead of reading the raw cookie.
 */
export async function getUserId(): Promise<string | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('userId')?.value
  return verifySession(token)
}