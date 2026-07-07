// GET /api/cms — Fetch all CMS content (or per section via ?section=hero)
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, apiError } from '@/lib/api-response'

export async function GET(req: NextRequest) {
  try {
    const section = req.nextUrl.searchParams.get('section')

    if (section) {
      const entries = await prisma.siteContent.findMany({
        where: { section },
        orderBy: { key: 'asc' },
      })
      return ok(entries)
    }

    // Return all grouped by section
    const entries = await prisma.siteContent.findMany({
      orderBy: [{ section: 'asc' }, { key: 'asc' }],
    })
    return ok(entries)
  } catch (error) {
    console.error('CMS GET error:', error)
    return apiError('INTERNAL_ERROR', 'Gagal mengambil konten', 500)
  }
}
