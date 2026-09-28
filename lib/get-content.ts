import { prisma } from '@/lib/prisma'
import { CONTENT_DEFAULTS } from '@/lib/content-defaults'

/**
 * Server-side helper: returns DB values merged over defaults.
 * Use in server components that need CMS content.
 */
export async function getContent(): Promise<Record<string, string>> {
  const rows = await prisma.siteContent.findMany()
  const map: Record<string, string> = { ...CONTENT_DEFAULTS }
  for (const r of rows) map[r.key] = r.value
  return map
}