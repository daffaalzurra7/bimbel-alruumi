// src/lib/storage/local.storage.ts
import { IStorageService } from './storage.interface'
import path from 'path'
import fs from 'fs/promises'

const UPLOAD_DIR = process.env.UPLOAD_DIR || './public/uploads'

export class LocalStorageService implements IStorageService {
  async upload(file: File, folder: string) {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`
    const uploadPath = path.join(UPLOAD_DIR, folder)

    await fs.mkdir(uploadPath, { recursive: true })
    await fs.writeFile(path.join(uploadPath, filename), buffer)

    return { url: `/uploads/${folder}/${filename}`, key: `${folder}/${filename}` }
  }

  async delete(key: string) {
    await fs.unlink(path.join(UPLOAD_DIR, key)).catch(() => {})
  }

  async getSignedUrl(key: string) {
    return `/uploads/${key}` // Local tidak perlu signed URL
  }
}
