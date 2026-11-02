import { supabase } from '@/lib/supabase'
import type { Profile, SiteContent, Category, Experience, Education, Skill, SocialLink } from '@/types'

// ===== PROFILE =====
export async function getProfile(): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

export async function updateProfile(id: string, updates: Partial<Profile>): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// ===== SITE CONTENT =====
export async function getSiteContent(): Promise<Record<string, Record<string, string>>> {
  const { data, error } = await supabase
    .from('site_content')
    .select('*')

  if (error) throw error

  const content: Record<string, Record<string, string>> = {}
  data?.forEach((item: SiteContent) => {
    if (!content[item.section]) content[item.section] = {}
    content[item.section][item.key] = item.value
  })
  return content
}

export async function updateSiteContent(section: string, key: string, value: string): Promise<void> {
  const { error } = await supabase
    .from('site_content')
    .upsert({ section, key, value }, { onConflict: 'section,key' })

  if (error) throw error
}

// ===== CATEGORIES =====
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) throw error
  return data || []
}

export async function createCategory(category: Partial<Category>): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .insert(category)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ===== EXPERIENCE =====
export async function getExperience(): Promise<Experience[]> {
  const { data, error } = await supabase
    .from('experience')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) throw error
  return data || []
}

export async function createExperience(exp: Partial<Experience>): Promise<Experience> {
  const { data, error } = await supabase
    .from('experience')
    .insert(exp)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateExperience(id: string, updates: Partial<Experience>): Promise<Experience> {
  const { data, error } = await supabase
    .from('experience')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteExperience(id: string): Promise<void> {
  const { error } = await supabase
    .from('experience')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ===== EDUCATION =====
export async function getEducation(): Promise<Education[]> {
  const { data, error } = await supabase
    .from('education')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) throw error
  return data || []
}

export async function createEducation(edu: Partial<Education>): Promise<Education> {
  const { data, error } = await supabase
    .from('education')
    .insert(edu)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateEducation(id: string, updates: Partial<Education>): Promise<Education> {
  const { data, error } = await supabase
    .from('education')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteEducation(id: string): Promise<void> {
  const { error } = await supabase
    .from('education')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ===== SKILLS =====
export async function getSkills(): Promise<Skill[]> {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) throw error
  return data || []
}

export async function createSkill(skill: Partial<Skill>): Promise<Skill> {
  const { data, error } = await supabase
    .from('skills')
    .insert(skill)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateSkill(id: string, updates: Partial<Skill>): Promise<Skill> {
  const { data, error } = await supabase
    .from('skills')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteSkill(id: string): Promise<void> {
  const { error } = await supabase
    .from('skills')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ===== SOCIAL LINKS =====
export async function getSocialLinks(): Promise<SocialLink[]> {
  const { data, error } = await supabase
    .from('social_links')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) throw error
  return data || []
}

export async function createSocialLink(link: Partial<SocialLink>): Promise<SocialLink> {
  const { data, error } = await supabase
    .from('social_links')
    .insert(link)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateSocialLink(id: string, updates: Partial<SocialLink>): Promise<SocialLink> {
  const { data, error } = await supabase
    .from('social_links')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteSocialLink(id: string): Promise<void> {
  const { error } = await supabase
    .from('social_links')
    .delete()
    .eq('id', id)

  if (error) throw error
}
