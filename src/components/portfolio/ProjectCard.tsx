import { Link } from 'react-router-dom'
import type { Project } from '@/types'
import { getPublicUrl } from '@/services/storage'

interface ProjectCardProps {
  project: Project
  theme?: 'dark' | 'light'
}

export default function ProjectCard({ project, theme = 'light' }: ProjectCardProps) {
  const coverUrl = project.cover_image
    ? project.cover_image.startsWith('http') || project.cover_image.startsWith('/')
      ? project.cover_image
      : getPublicUrl(project.cover_image)
    : null

  const isDark = theme === 'dark'

  return (
    <Link
      to={`/work/${project.slug}`}
      className={`group block rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
        isDark
          ? 'bg-white/5 border border-white/10 hover:border-white/20 shadow-lg shadow-black/20'
          : 'bg-white border border-ink/5 hover:border-ink/15 shadow-sm hover:shadow-xl'
      }`}
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-ink/5">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={project.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center font-display font-bold text-4xl ${isDark ? 'text-white/20' : 'text-ink/20'}`}>
            {project.title.charAt(0)}
          </div>
        )}
        
        {/* Category tag */}
        {project.category && (
          <span className={`absolute top-3 left-3 text-[11px] font-semibold tracking-wider uppercase rounded-full px-3 py-1 backdrop-blur-md ${
            isDark ? 'bg-black/60 text-white/90 border border-white/10' : 'bg-white/90 text-ink shadow-sm'
          }`}>
            {project.category.name}
          </span>
        )}

        {project.featured && (
          <span className="absolute top-3 right-3 text-[11px] font-bold rounded-full px-2.5 py-0.5 bg-amber-400 text-ink">
            ★ Featured
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className={`font-display font-semibold text-lg leading-snug transition-colors group-hover:text-amber-500 ${
              isDark ? 'text-white' : 'text-ink'
            }`}>
              {project.title}
            </h3>
            {project.short_description && (
              <p className={`text-sm mt-1.5 line-clamp-2 leading-relaxed ${
                isDark ? 'text-white/60' : 'text-ink-muted'
              }`}>
                {project.short_description}
              </p>
            )}
          </div>

          <span className={`shrink-0 grid place-items-center w-8 h-8 rounded-full text-xs font-semibold transition-all group-hover:rotate-45 ${
            isDark ? 'bg-white/10 text-white group-hover:bg-amber-400 group-hover:text-ink' : 'bg-ink/5 text-ink group-hover:bg-ink group-hover:text-white'
          }`}>
            ↗
          </span>
        </div>

        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-ink/5 text-xs text-ink-muted">
          {project.client && <span>Client: <strong className={isDark ? 'text-white/80' : 'text-ink'}>{project.client}</strong></span>}
          {project.year && <span>• {project.year}</span>}
        </div>
      </div>
    </Link>
  )
}

