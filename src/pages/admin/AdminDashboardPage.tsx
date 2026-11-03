import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllProjects } from '@/services/projects'
import { getCategories } from '@/services/content'
import type { Project, Category } from '@/types'

export default function AdminDashboardPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [p, c] = await Promise.all([
          getAllProjects(),
          getCategories()
        ])
        setProjects(p)
        setCategories(c)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const publishedCount = projects.filter(p => p.published).length
  const draftCount = projects.filter(p => !p.published).length
  const featuredCount = projects.filter(p => p.featured).length

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">
            Dashboard Overview
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            Welcome to your portfolio CMS. Manage projects, sections, and site content.
          </p>
        </div>

        <Link
          to="/admin/projects/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ink text-white font-medium text-sm hover:bg-ink-light transition-all shadow-sm"
        >
          <span>+ Create New Project</span>
        </Link>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl bg-white border border-ink/10 shadow-sm">
          <span className="text-xs font-mono uppercase text-ink-muted">Total Projects</span>
          <p className="font-display text-3xl sm:text-4xl font-bold text-ink mt-2">
            {loading ? '...' : projects.length}
          </p>
          <span className="text-xs text-ink-muted mt-1 block">In repository</span>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-ink/10 shadow-sm">
          <span className="text-xs font-mono uppercase text-emerald-600">Published</span>
          <p className="font-display text-3xl sm:text-4xl font-bold text-emerald-600 mt-2">
            {loading ? '...' : publishedCount}
          </p>
          <span className="text-xs text-ink-muted mt-1 block">Live on portfolio</span>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-ink/10 shadow-sm">
          <span className="text-xs font-mono uppercase text-amber-600">Drafts</span>
          <p className="font-display text-3xl sm:text-4xl font-bold text-amber-600 mt-2">
            {loading ? '...' : draftCount}
          </p>
          <span className="text-xs text-ink-muted mt-1 block">Hidden from public</span>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-ink/10 shadow-sm">
          <span className="text-xs font-mono uppercase text-accent">Categories</span>
          <p className="font-display text-3xl sm:text-4xl font-bold text-accent mt-2">
            {loading ? '...' : categories.length}
          </p>
          <span className="text-xs text-ink-muted mt-1 block">Portfolio groupings</span>
        </div>
      </div>

      {/* Recent Projects Table */}
      <div className="bg-white rounded-2xl border border-ink/10 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-ink/10 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-ink">
              Recent Projects
            </h2>
            <p className="text-xs text-ink-muted mt-0.5">
              Quickly preview or modify recent creations
            </p>
          </div>
          <Link
            to="/admin/projects"
            className="text-xs font-semibold text-accent hover:underline"
          >
            View all ({projects.length}) →
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="p-12 text-center text-ink-muted">
            <p className="text-sm font-medium">No projects added yet.</p>
            <Link
              to="/admin/projects/new"
              className="inline-block mt-4 text-xs font-semibold text-accent hover:underline"
            >
              + Create your first project now
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-ink/5 text-ink-muted text-xs uppercase tracking-wider font-mono">
                <tr>
                  <th className="py-3 px-6">Project</th>
                  <th className="py-3 px-6">Category</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Client / Year</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {projects.slice(0, 5).map((project) => (
                  <tr key={project.id} className="hover:bg-ink/[0.02] transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-ink/5 shrink-0">
                          {project.cover_image ? (
                            <img
                              src={project.cover_image}
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-ink/20">
                              {project.title.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-ink leading-tight">{project.title}</p>
                          <p className="text-xs text-ink-muted font-mono">{project.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-xs text-ink-muted">
                      {project.category?.name || 'Unassigned'}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          project.published
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {project.published ? 'Live' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-ink-muted">
                      {project.client || '—'} {project.year ? `(${project.year})` : ''}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        to={`/admin/projects/${project.id}/edit`}
                        className="text-xs font-semibold text-ink hover:text-accent"
                      >
                        Edit ↗
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Link
          to="/admin/content"
          className="p-6 rounded-2xl bg-white border border-ink/10 shadow-sm hover:border-accent transition-all group"
        >
          <span className="text-2xl block mb-2">📝</span>
          <h3 className="font-display font-bold text-ink group-hover:text-accent transition-colors">
            Site Headings & Bio
          </h3>
          <p className="text-xs text-ink-muted mt-1 leading-relaxed">
            Update your hero headline, about description, contact text, and footer copyright without touching code.
          </p>
        </Link>

        <Link
          to="/admin/categories"
          className="p-6 rounded-2xl bg-white border border-ink/10 shadow-sm hover:border-accent transition-all group"
        >
          <span className="text-2xl block mb-2">📁</span>
          <h3 className="font-display font-bold text-ink group-hover:text-accent transition-colors">
            Categories & Tags
          </h3>
          <p className="text-xs text-ink-muted mt-1 leading-relaxed">
            Manage your project taxonomy: Logo Design, Branding, Social Media, Thumbnails, Banners.
          </p>
        </Link>

        <Link
          to="/admin/settings"
          className="p-6 rounded-2xl bg-white border border-ink/10 shadow-sm hover:border-accent transition-all group"
        >
          <span className="text-2xl block mb-2">⚙️</span>
          <h3 className="font-display font-bold text-ink group-hover:text-accent transition-colors">
            Profile & Socials
          </h3>
          <p className="text-xs text-ink-muted mt-1 leading-relaxed">
            Modify your email, phone, location, Behance, Instagram, Dribbble, and LinkedIn links.
          </p>
        </Link>
      </div>
    </div>
  )
}

