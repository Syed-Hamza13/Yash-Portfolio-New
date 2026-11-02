import { supabase } from '@/lib/supabase'
import type { Project, ProjectImage } from '@/types'

export async function getPublishedProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*, category:categories(*)')
    .eq('published', true)
    .order('display_order', { ascending: true })

  if (error) throw error
  return data || []
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*, category:categories(*), images:project_images(*)')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*, category:categories(*)')
    .eq('published', true)
    .eq('featured', true)
    .order('display_order', { ascending: true })
    .limit(6)

  if (error) throw error
  return data || []
}

export async function getProjectsByCategory(categorySlug: string): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*, category:categories!inner(*)')
    .eq('published', true)
    .eq('categories.slug', categorySlug)
    .order('display_order', { ascending: true })

  if (error) throw error
  return data || []
}

// ===== ADMIN =====

export async function getAllProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*, category:categories(*)')
    .order('display_order', { ascending: true })

  if (error) throw error
  return data || []
}

export async function getProjectById(id: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*, category:categories(*), images:project_images(*)')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function createProject(project: Partial<Project>): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function addProjectImage(image: Partial<ProjectImage>): Promise<ProjectImage> {
  const { data, error } = await supabase
    .from('project_images')
    .insert(image)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteProjectImage(id: string): Promise<void> {
  const { error } = await supabase
    .from('project_images')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function reorderProjects(updates: { id: string; display_order: number }[]): Promise<void> {
  const promises = updates.map(({ id, display_order }) =>
    supabase.from('projects').update({ display_order }).eq('id', id)
  )
  await Promise.all(promises)
}
