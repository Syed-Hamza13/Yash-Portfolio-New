import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Container from '@/components/common/Container'
import Button from '@/components/common/Button'
import LoadingState from '@/components/common/LoadingState'
import ProjectCard from '@/components/portfolio/ProjectCard'
import { getProjectBySlug, getPublishedProjects } from '@/services/projects'
import { getPublicUrl } from '@/services/storage'
import type { Project } from '@/types'

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [project, setProject] = useState<Project | null>(null)
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProject() {
      if (!slug) return
      setLoading(true)
      try {
        const found = await getProjectBySlug(slug)
        if (found) {
          setProject(found)
          // Fetch related projects
          const all = await getPublishedProjects()
          const related = all
            .filter((p) => p.id !== found.id && p.category_id === found.category_id)
            .slice(0, 3)
          setRelatedProjects(related)
        }
      } catch (err) {
        console.error('Error loading project:', err)
      } finally {
        setLoading(false)
      }
    }
    loadProject()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20">
        <Container>
          <LoadingState message="Loading case study..." />
        </Container>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen pt-36 pb-20 text-center">
        <Container narrow>
          <span className="text-4xl block mb-4">🔍</span>
          <h1 className="font-display text-3xl font-bold text-ink">Project Not Found</h1>
          <p className="text-sm text-ink-muted mt-2 mb-8">
            The project you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/work">
            <Button variant="primary">Return to Portfolio</Button>
          </Link>
        </Container>
      </div>
    )
  }

  const coverUrl = project.cover_image
    ? project.cover_image.startsWith('http') || project.cover_image.startsWith('/')
      ? project.cover_image
      : getPublicUrl(project.cover_image)
    : null

  return (
    <div className="pt-28 pb-20 bg-paper min-h-screen">
      <Helmet>
        <title>{project.title} — Yash Chourey Case Study</title>
        <meta
          name="description"
          content={project.short_description || `Case study for ${project.title} by graphic designer Yash Chourey.`}
        />
        <meta property="og:title" content={`${project.title} — Yash Chourey`} />
        {coverUrl && <meta property="og:image" content={coverUrl} />}
      </Helmet>

      {/* Header Info */}
      <Container>
        {/* Back Link */}
        <div className="mb-8">
          <Link
            to="/work"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-muted hover:text-ink transition-colors"
          >
            <span>← Back to all projects</span>
          </Link>
        </div>

        {/* Title & Metadata */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-ink/10">
          <div className="lg:col-span-8">
            {project.category && (
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-accent block mb-3">
                {project.category.name}
              </span>
            )}
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-ink leading-[1.05]">
              {project.title}
            </h1>
            {project.short_description && (
              <p className="text-lg sm:text-xl text-ink-muted mt-5 leading-relaxed font-normal">
                {project.short_description}
              </p>
            )}
          </div>

          <div className="lg:col-span-4 p-6 sm:p-7 rounded-2xl bg-cream space-y-4 self-start">
            {project.client && (
              <div>
                <span className="text-xs font-mono uppercase text-ink-muted block">Client</span>
                <p className="font-display font-semibold text-ink text-base">{project.client}</p>
              </div>
            )}
            {project.year && (
              <div>
                <span className="text-xs font-mono uppercase text-ink-muted block">Year</span>
                <p className="font-display font-semibold text-ink text-base">{project.year}</p>
              </div>
            )}
            {project.services && (
              <div>
                <span className="text-xs font-mono uppercase text-ink-muted block">Services</span>
                <p className="font-display font-semibold text-ink text-sm leading-snug">{project.services}</p>
              </div>
            )}
          </div>
        </div>

        {/* Cover Image */}
        {coverUrl && (
          <div className="my-10 rounded-3xl overflow-hidden shadow-2xl bg-ink/5 border border-ink/10">
            <img
              src={coverUrl}
              alt={project.title}
              className="w-full h-auto max-h-[85vh] object-cover"
            />
          </div>
        )}

        {/* Full Case Study Narrative */}
        {project.full_description && (
          <div className="max-w-3xl mx-auto my-14 space-y-6 text-base sm:text-lg text-ink/80 leading-relaxed">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink mb-6">
              Concept, Execution & Art Direction
            </h2>
            {project.full_description.split('\n').filter(Boolean).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        )}

        {/* Gallery Images */}
        {project.images && project.images.length > 0 && (
          <div className="my-16 space-y-8">
            <h3 className="font-display text-2xl font-bold text-ink">
              Gallery & Detail Collateral
            </h3>
            <div className="grid sm:grid-cols-2 gap-6">
              {project.images.map((img) => {
                const imgUrl = img.image_url.startsWith('http') || img.image_url.startsWith('/')
                  ? img.image_url
                  : getPublicUrl(img.image_url)
                return (
                  <div key={img.id} className="rounded-2xl overflow-hidden shadow-md bg-ink/5 border border-ink/10">
                    <img
                      src={imgUrl}
                      alt={img.alt_text || project.title}
                      loading="lazy"
                      className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <div className="mt-24 pt-16 border-t border-ink/10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-display text-2xl font-bold text-ink">
                More in {project.category?.name || 'this category'}
              </h3>
              <Link to="/work" className="text-sm font-semibold text-accent hover:underline">
                View all projects →
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProjects.map((rel) => (
                <ProjectCard key={rel.id} project={rel} theme="light" />
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  )
}

