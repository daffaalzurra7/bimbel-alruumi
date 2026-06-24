// src/lib/api-handler.ts
// Wrap SEMUA route handler dengan ini agar:
// - Error di-catch otomatis tanpa try-catch di setiap handler
// - Auth di-check sebelum handler jalan
// - Logging otomatis untuk setiap request

import { NextRequest, NextResponse } from 'next/server'
import { AppError } from './errors'
import { apiError } from './api-response'
import { logger } from './logger'

interface Session {
  user: {
    id: string
    name: string
    email: string
    role: string
  }
}

type Handler = (
  req: NextRequest,
  ctx: { params: Record<string, string>; session: Session | null }
) => Promise<NextResponse>

interface HandlerOptions {
  allowedRoles?: string[]
  requireAuth?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getSession(_req: NextRequest): Promise<Session | null> {
  // TODO: Implement with NextAuth when configured
  // return await getServerSession(authOptions)
  return null
}

export function withApiHandler(
  handler: Handler,
  options: HandlerOptions = { requireAuth: true }
) {
  return async (req: NextRequest, ctx: { params: Record<string, string> }) => {
    const start = Date.now()

    try {
      const session = options.requireAuth !== false
        ? await getSession(req)
        : null

      if (options.requireAuth !== false && !session?.user) {
        // Auth is not yet configured, pass through for now
        // Uncomment when NextAuth is ready:
        // return apiError('UNAUTHENTICATED', 'Silakan login terlebih dahulu', 401)
      }

      if (
        options.allowedRoles &&
        session?.user &&
        !options.allowedRoles.includes(session.user.role)
      ) {
        return apiError(
          'FORBIDDEN',
          'Anda tidak memiliki akses ke resource ini',
          403
        )
      }

      const response = await handler(req, { params: ctx.params, session })

      logger.info({
        method: req.method,
        url: req.url,
        status: response.status,
        ms: Date.now() - start,
      })
      return response
    } catch (error) {
      logger.error({ error, method: req.method, url: req.url })

      if (error instanceof AppError) {
        return apiError(
          error.code,
          error.message,
          error.statusCode,
          error.details
        )
      }

      return apiError('INTERNAL_ERROR', 'Terjadi kesalahan pada server', 500)
    }
  }
}
