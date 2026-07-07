// PUT /api/cms/[section] — Update CMS content for a specific section
// Expects body: { entries: [{ key: string, value: any }] }
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, apiError } from '@/lib/api-response'
import { auth } from '@/lib/auth'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  try {
    // Check auth — admin only
    const session = await auth()
    const role = (session?.user as { role?: string })?.role
    if (!session?.user || role !== 'ADMIN') {
      return apiError('FORBIDDEN', 'Hanya admin yang bisa mengubah konten', 403)
    }

    const { section } = await params
    const body = await req.json()
    const { entries } = body as { entries: Array<{ key: string; value: unknown }> }

    if (!entries || !Array.isArray(entries)) {
      return apiError('VALIDATION_ERROR', 'Format body tidak valid. Gunakan { entries: [{ key, value }] }', 400)
    }

    const validSections = ['hero', 'visi_misi', 'program', 'keunggulan', 'aturan', 'footer']
    if (!validSections.includes(section)) {
      return apiError('VALIDATION_ERROR', `Section tidak valid: ${section}`, 400)
    }

    // Upsert each entry
    const results = []
    for (const entry of entries) {
      if (!entry.key || entry.value === undefined) continue

      const result = await prisma.siteContent.upsert({
        where: { section_key: { section, key: entry.key } },
        update: {
          value: entry.value as never,
          updatedBy: session.user.id,
        },
        create: {
          section,
          key: entry.key,
          value: entry.value as never,
          updatedBy: session.user.id,
        },
      })
      results.push(result)
    }

    return ok(results)
  } catch (error) {
    console.error('CMS PUT error:', error)
    return apiError('INTERNAL_ERROR', 'Gagal menyimpan konten', 500)
  }
}
