// src/lib/logger.ts
// Structured JSON logging. Di production, output di-parse oleh log aggregator.
// Di development, output dibuat human-readable.

import pino from 'pino'

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  ...(process.env.NODE_ENV === 'development' && {
    transport: {
      target: 'pino-pretty',
      options: { colorize: true, translateTime: 'SYS:standard' },
    },
  }),
  base: { service: 'bimbel-alruumi' },
})

// Buat child logger per fitur untuk mudah filter di log aggregator
export const createLogger = (feature: string) => logger.child({ feature })
