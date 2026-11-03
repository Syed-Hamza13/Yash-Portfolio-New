import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Container from '@/components/common/Container'
import ProjectCard from './ProjectCard'
import { getFeaturedProjects } from '@/services/projects'
import type { Project } from '@/types'

// Fallback curated projects in case DB has not yet been seeded
const FALLBACK_PROJECTS: Project[] = [
  {
    id: 'f1',
    title: 'Arion Luxury Fragrance Identity',
    slug: 'arion-luxury-fragrance',
    short_description: 'High-end branding, packaging system, and brand guidelines for artisanal perfumery.',
    full_description: 'Complete brand development including logomark, custom typography, luxury packaging embossing, and social design.',
    category_id: 'cat-1',
    category: { id: 'cat-1', name: 'Branding', slug: 'branding', description: null, display_order: 1, created_at: '' },
    cover_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
    client: 'Arion Parfums',
    year: '2025',
    services: 'Brand Identity, Packaging, Art Direction',
    featured: true,
    published: true,
    display_order: 1,
    created_at: '',
    updated_at: ''
  },
  {
    id: 'f2',
    title: 'Swan Royal Hospitality Identity',
    slug: 'swan-royal-hospitality',
    short_description: 'Deep navy & gold brand identity, stationery suite, and premium signages for boutique resort.',
    full_description: 'Crafted the full guest visual experience including menus, keycards, stationery, and architectural emblems.',
    category_id: 'cat-1',
    category: { id: 'cat-1', name: 'Branding', slug: 'branding', description: null, display_order: 1, created_at: '' },
    cover_image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1000&q=80',
    client: 'Swan Grand',
    year: '2024',
    services: 'Visual Identity, Signage, Stationery',
    featured: true,
    published: true,
    display_order: 2,
    created_at: '',
    updated_at: ''
  },
  {
    id: 'f3',
    title: 'Creative Studio Rebrand & Logofolio',
    slug: 'creative-studio-logofolio',
    short_description: 'Dynamic typographic logos and mascot integration for a cutting-edge 3D animation lab.',
    full_description: 'A vibrant, bold aesthetic pairing high-contrast typography with custom character art.',
    category_id: 'cat-2',
    category: { id: 'cat-2', name: 'Logo Design', slug: 'logo-design', description: null, display_order: 2, created_at: '' },
    cover_image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1000&q=80',
    client: 'Creative Studio',
    year: '2024',
    services: 'Logo System, Mascot Design',
    featured: true,
    published: true,
    display_order: 3,
    created_at: '',
    updated_at: ''
  },
  {
    id: 'f4',
    title: 'Fintech Mobile Viral Social Creative Suite',
    slug: 'fintech-social-creatives',
    short_description: 'High-converting Instagram carousel ads, story templates, and visual campaign assets.',
    full_description: 'Designed engaging 1080x1920 and 1080x1350 editorial formats maximizing scroll-stop rates.',
    category_id: 'cat-3',
    category: { id: 'cat-3', name: 'Social Media', slug: 'social-media', description: null, display_order: 3, created_at: '' },
    cover_image: 'https://images.unsplash.com/photo-1616469829941-c7200edec809?auto=format&fit=crop&w=1000&q=80',
    client: 'GrowFast App',
    year: '2025',
    services: 'Social Campaign, Ad Creatives',
    featured: true,
    published: true,
    display_order: 4,
    created_at: '',
    updated_at: ''
  },
  {
    id: 'f5',
    title: 'Investigative Documentary High-CTR Thumbnails',
    slug: 'documentary-youtube-thumbnails',
    short_description: 'Hyper-dramatic, high-contrast YouTube thumbnails generating millions of impressions.',
    full_description: 'Mastery of focal lighting, expressive facial composites, and 3D typography for maximum click-through.',
    category_id: 'cat-4',
    category: { id: 'cat-4', name: 'Thumbnails', slug: 'thumbnails', description: null, display_order: 4, created_at: '' },
    cover_image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80',
    client: 'Apex Media Channel',
    year: '2024',
    services: 'Thumbnails, Photo Retouching',
    featured: true,
    published: true,
    display_order: 5,
    created_at: '',
    updated_at: ''
  },
  {
    id: 'f6',
    title: 'Audiophile Smartwatch A+ Amazon Content',
    slug: 'smartwatch-amazon-a-plus-content',
    short_description: 'Comprehensive e-commerce visual storytelling modules, spec breakdowns, and banners.',
    full_description: 'Elevated product listing with immersive dark mode renders, detail callouts, and lifestyle compositions.',
    category_id: 'cat-5',
    category: { id: 'cat-5', name: 'A+ Content', slug: 'a-plus-content', description: null, display_order: 5, created_at: '' },
    cover_image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1000&q=80',
    client: 'Vanguard Tech',
    year: '2024',
    services: 'E-commerce Design, A+ Listing Modules',
    featured: true,
    published: true,
    display_order: 6,
    created_at: '',
    updated_at: ''
  }
]

export default function FeaturedWork() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getFeaturedProjects()
      .then((data) => {
        if (data && data.length > 0) {
          setProjects(data)
        } else {
          setProjects(FALLBACK_PROJECTS)
        }
      })
      .catch(() => {
        setProjects(FALLBACK_PROJECTS)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="py-20 md:py-28 bg-[#12121c] text-white">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              Featured Case Studies & Output
            </h2>
          </div>

          <Link
            to="/work"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-all border border-white/10 self-start md:self-end"
          >
            <span>Explore Entire Archive</span>
            <span>→</span>
          </Link>
        </div>

        {/* Project Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} theme="dark" />
          ))}
        </div>
      </Container>
    </section>
  )
}

