/**
 * Conditionally join class names
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Generate a URL-safe slug from text
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length).trimEnd() + '…'
}

/**
 * Format date to readable string
 */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

/**
 * Format year from date
 */
export function formatYear(date: string | Date): string {
  return new Date(date).getFullYear().toString()
}

/**
 * Get Supabase public URL for a storage file
 */
export function getStorageUrl(bucket: string, path: string): string {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  if (!supabaseUrl || !path) return ''
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`
}

/**
 * Debounce a function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
