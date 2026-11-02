import { supabase } from '@/lib/supabase'

const BUCKET = 'portfolio'
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']

export interface UploadResult {
  path: string
  url: string
}

/**
 * Upload an image to Supabase Storage
 */
export async function uploadImage(
  file: File,
  folder: string = 'general'
): Promise<UploadResult> {
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`)
  }

  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`File type ${file.type} is not allowed. Allowed: ${ALLOWED_TYPES.join(', ')}`)
  }

  // Generate unique filename
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const timestamp = Date.now()
  const randomStr = Math.random().toString(36).substring(2, 8)
  const fileName = `${timestamp}-${randomStr}.${ext}`
  const filePath = `${folder}/${fileName}`

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) throw error

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(filePath)

  return {
    path: filePath,
    url: urlData.publicUrl,
  }
}

/**
 * Delete an image from Supabase Storage
 */
export async function deleteImage(path: string): Promise<void> {
  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([path])

  if (error) throw error
}

/**
 * Get public URL for a storage file
 */
export function getPublicUrl(path: string): string {
  if (!path) return ''
  if (path.startsWith('http')) return path

  const { data } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(path)

  return data.publicUrl
}
