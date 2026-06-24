// src/lib/storage/index.ts
import { LocalStorageService } from './local.storage'

const STORAGE_PROVIDER = process.env.STORAGE_PROVIDER || 'local'

export const storageService = STORAGE_PROVIDER === 's3'
  ? (() => { throw new Error('S3 storage belum dikonfigurasi. Set STORAGE_PROVIDER=local atau implementasikan S3StorageService.') })()
  : new LocalStorageService()
