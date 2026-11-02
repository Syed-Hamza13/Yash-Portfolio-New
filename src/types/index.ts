/* ===== Database Types ===== */

export interface Profile {
  id: string
  full_name: string
  title: string
  bio: string
  avatar_url: string | null
  resume_url: string | null
  location: string
  email: string
  phone: string | null
  updated_at: string
}

export interface SiteContent {
  id: string
  section: string
  key: string
  value: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  display_order: number
  created_at: string
}

export interface Project {
  id: string
  title: string
  slug: string
  short_description: string
  full_description: string | null
  category_id: string
  cover_image: string | null
  client: string | null
  year: string | null
  services: string | null
  featured: boolean
  published: boolean
  display_order: number
  created_at: string
  updated_at: string
  // Joined
  category?: Category
  images?: ProjectImage[]
}

export interface ProjectImage {
  id: string
  project_id: string
  image_url: string
  alt_text: string | null
  display_order: number
  created_at: string
}

export interface Experience {
  id: string
  company: string
  position: string
  description: string | null
  start_date: string
  end_date: string | null
  current: boolean
  display_order: number
  created_at: string
}

export interface Education {
  id: string
  institution: string
  degree: string
  description: string | null
  start_date: string
  end_date: string | null
  current: boolean
  display_order: number
  created_at: string
}

export interface Skill {
  id: string
  name: string
  category: string
  proficiency: number
  display_order: number
  created_at: string
}

export interface SocialLink {
  id: string
  platform: string
  url: string
  icon: string | null
  display_order: number
  created_at: string
}

/* ===== Form Types ===== */

export interface ContactForm {
  name: string
  email: string
  message: string
}

/* ===== UI Types ===== */

export interface NavItem {
  label: string
  href: string
  isPage?: boolean
}

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}
