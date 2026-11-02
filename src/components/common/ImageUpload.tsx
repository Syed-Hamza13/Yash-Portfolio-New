import { useState, useRef, type ChangeEvent } from 'react'
import { cn } from '@/lib/utils'
import { uploadImage, type UploadResult } from '@/services/storage'

interface ImageUploadProps {
  currentImage?: string
  folder?: string
  onUpload: (result: UploadResult) => void
  onError?: (error: string) => void
  className?: string
  label?: string
}

export default function ImageUpload({
  currentImage,
  folder = 'general',
  onUpload,
  onError,
  className,
  label = 'Upload Image',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show preview
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)

    setUploading(true)
    try {
      const result = await uploadImage(file, folder)
      onUpload(result)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload failed'
      onError?.(msg)
      setPreview(null)
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const displayImage = preview || currentImage

  return (
    <div className={cn('relative', className)}>
      <label className="block text-sm font-medium text-ink mb-2">{label}</label>
      <div
        onClick={() => inputRef.current?.click()}
        className={cn(
          'relative cursor-pointer rounded-xl border-2 border-dashed border-ink/15 hover:border-accent/50 transition-colors overflow-hidden',
          displayImage ? 'h-48' : 'h-40',
          uploading && 'pointer-events-none opacity-60'
        )}
      >
        {displayImage ? (
          <img
            src={displayImage}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-ink-muted">
            <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm">Click to upload</span>
            <span className="text-xs mt-1 opacity-60">JPG, PNG, WebP · Max 5MB</span>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <svg className="animate-spin h-6 w-6 text-accent" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  )
}
