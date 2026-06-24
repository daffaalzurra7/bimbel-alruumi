// src/lib/errors.ts
// Hierarchy error yang jelas. Service tinggal throw AppError dengan kode yang sesuai.
// API handler otomatis translate ke HTTP response yang benar.

export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly code: string,
    public readonly statusCode: number = 400,
    public readonly details?: unknown,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class NotFoundError extends AppError {
  constructor(entity: string, id?: string) {
    super(
      id ? `${entity} dengan ID '${id}' tidak ditemukan` : `${entity} tidak ditemukan`,
      'NOT_FOUND',
      404,
    )
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Anda tidak memiliki akses ke resource ini') {
    super(message, 'UNAUTHORIZED', 403)
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 'CONFLICT', 409)
  }
}

export class ValidationError extends AppError {
  constructor(details: unknown) {
    super('Data yang dikirim tidak valid', 'VALIDATION_ERROR', 422, details)
  }
}
