// src/lib/cms.ts
// CMS helper — fetch landing page content from database

import { prisma } from '@/lib/prisma'

export interface SiteContentEntry {
  id: string
  section: string
  key: string
  value: unknown
  updatedAt: Date
  updatedBy: string | null
}

/**
 * Fetch all content entries for a given section.
 */
export async function getSectionContent(section: string): Promise<SiteContentEntry[]> {
  return prisma.siteContent.findMany({
    where: { section },
    orderBy: { key: 'asc' },
  })
}

/**
 * Fetch all content entries (for admin overview).
 */
export async function getAllContent(): Promise<SiteContentEntry[]> {
  return prisma.siteContent.findMany({
    orderBy: [{ section: 'asc' }, { key: 'asc' }],
  })
}

/**
 * Convert array of SiteContentEntry to a key-value map.
 * Example: [{ key: "headline", value: "Hello" }] => { headline: "Hello" }
 */
export function getContentMap(entries: SiteContentEntry[]): Record<string, unknown> {
  const map: Record<string, unknown> = {}
  for (const entry of entries) {
    map[entry.key] = entry.value
  }
  return map
}
