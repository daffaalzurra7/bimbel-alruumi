// src/lib/prisma.ts
// Prisma 7 requires adapter pattern for database connections
// Singleton pattern prevents connection leak during hot reload

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    // During build time or when no DB is configured, return a client
    // that will fail at runtime with a clear error
    console.warn('⚠️ DATABASE_URL not set. Database operations will fail.')
    const adapter = new PrismaPg({ connectionString: 'postgresql://placeholder:placeholder@localhost:5432/placeholder' })
    return new PrismaClient({ adapter })
  }

  const adapter = new PrismaPg({ connectionString })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
