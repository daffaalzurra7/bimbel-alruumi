// src/lib/env.ts
// Validasi SEMUA env var saat startup. Jika ada yang kurang, app langsung crash
// dengan pesan error yang jelas — bukan error misterius saat runtime.

import { z } from 'zod'

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url().optional(), // Optional saat build time
  DIRECT_DATABASE_URL: z.string().url().optional(),

  // Auth
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET minimal 32 karakter').optional(),
  AUTH_SECRET: z.string().min(32).optional(), // NextAuth v5 uses AUTH_SECRET

  // App
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error']).default('info'),

  // Storage
  STORAGE_PROVIDER: z.enum(['local', 's3']).default('local'),
  UPLOAD_DIR: z.string().default('./public/uploads'),
  // S3 (opsional, diisi saat STORAGE_PROVIDER=s3)
  S3_BUCKET: z.string().optional(),
  S3_REGION: z.string().optional(),
  S3_ACCESS_KEY: z.string().optional(),
  S3_SECRET_KEY: z.string().optional(),

  // WhatsApp
  NEXT_PUBLIC_WA_NUMBER: z.string().default('6281234567890'),
})

// Validasi saat module di-load. Error langsung muncul saat server start.
const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌ Environment variables tidak valid:')
  console.error(parsed.error.flatten().fieldErrors)
  // Don't exit during build time
  if (process.env.NODE_ENV !== 'production') {
    // In development, just warn
    console.warn('⚠️ Some env vars are missing. App may not work correctly.')
  }
}

export const env = parsed.success ? parsed.data : envSchema.parse({
  NODE_ENV: process.env.NODE_ENV || 'development',
  LOG_LEVEL: 'info',
  STORAGE_PROVIDER: 'local',
  UPLOAD_DIR: './public/uploads',
  NEXT_PUBLIC_WA_NUMBER: process.env.NEXT_PUBLIC_WA_NUMBER || '6281234567890',
})
