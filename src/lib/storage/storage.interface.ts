// src/lib/storage/storage.interface.ts
// Dengan interface ini, ganti local → S3 hanya perlu:
// 1. Buat s3.storage.ts yang implements interface ini
// 2. Ganti STORAGE_PROVIDER=s3 di .env
// Tidak perlu ubah kode di fitur pembayaran sama sekali.

export interface IStorageService {
  upload(file: File, folder: string): Promise<{ url: string; key: string }>
  delete(key: string): Promise<void>
  getSignedUrl(key: string, expiresInSeconds: number): Promise<string>
}
