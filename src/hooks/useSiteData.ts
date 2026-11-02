import { useState, useEffect } from 'react'
import type { Profile, Category, Experience, Education, Skill, SocialLink } from '@/types'
import { getProfile, getSiteContent, getCategories, getExperience, getEducation, getSkills, getSocialLinks } from '@/services/content'
import { getFeaturedProjects } from '@/services/projects'
import type { Project } from '@/types'

interface SiteData {
  profile: Profile | null
  content: Record<string, Record<string, string>>
  categories: Category[]
  experience: Experience[]
  education: Education[]
  skills: Skill[]
  socialLinks: SocialLink[]
  featuredProjects: Project[]
  loading: boolean
  error: string | null
}

export function useSiteData(): SiteData {
  const [data, setData] = useState<SiteData>({
    profile: null,
    content: {},
    categories: [],
    experience: [],
    education: [],
    skills: [],
    socialLinks: [],
    featuredProjects: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    async function fetchAll() {
      try {
        const [profile, content, categories, experience, education, skills, socialLinks, featuredProjects] =
          await Promise.all([
            getProfile(),
            getSiteContent(),
            getCategories(),
            getExperience(),
            getEducation(),
            getSkills(),
            getSocialLinks(),
            getFeaturedProjects(),
          ])

        setData({
          profile,
          content,
          categories,
          experience,
          education,
          skills,
          socialLinks,
          featuredProjects,
          loading: false,
          error: null,
        })
      } catch (err) {
        setData(prev => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : 'Failed to load site data',
        }))
      }
    }

    fetchAll()
  }, [])

  return data
}
