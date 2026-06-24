// src/lib/api-response.ts
// SEMUA response API harus pakai format ini — konsisten dari v1 hingga v-berapa pun nanti.

import { NextResponse } from 'next/server'

export type ApiResponse<T = undefined> =
  | { success: true; data: T; meta?: PaginationMeta }
  | { success: false; error: { code: string; message: string; details?: unknown } }

export interface PaginationMeta {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export const ok = <T>(data: T, meta?: PaginationMeta, status = 200) =>
  NextResponse.json<ApiResponse<T>>({ success: true, data, ...(meta && { meta }) }, { status })

export const created = <T>(data: T) => ok(data, undefined, 201)

export const apiError = (code: string, message: string, status = 400, details?: unknown) =>
  NextResponse.json<ApiResponse>(
    { success: false, error: { code, message, details } },
    { status },
  )
