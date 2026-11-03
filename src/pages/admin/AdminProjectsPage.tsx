import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Button from '@/components/common/Button'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import LoadingState from '@/components/common/LoadingState'
import { getAllProjects, deleteProject, updateProject } from '@/services/projects'
import type { Project } from '@/types'

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null)
  const [deleting, setDeleting] = useState(false)

  const loadProjects = async () => {
    try {
      setLoading(true)
      const data = await getAllProjects()
      setProjects(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteProject(deleteTarget.id)
      setProjects(projects.filter((p) => p.id !== deleteTarget.id))
      setDeleteTarget(null)
    } catch (err) {
      alert('Failed to delete project: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setDeleting(false)
    }
  }

  const togglePublished = async (project: Project) => {
    try {
      const updated = await updateProject(project.id, { published: !project.published })
      setProjects(projects.map((p) => (p.id === project.id ? { ...p, published: updated.published } : p)))
    } catch (err) {
      alert('Failed to toggle status: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  const toggleFeatured = async (project: Project) => {
    try {
      const updated = await updateProject(project.id, { featured: !project.featured })
      setProjects(projects.map((p) => (p.id === project.id ? { ...p, featured: updated.featured } : p)))
    } catch (err) {
      alert('Failed to toggle featured: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">
            Project Management
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            Create, edit, reorder, and publish portfolio case studies.
          </p>
        </div>

        <Link to="/admin/projects/new">
          <Button variant="primary" size="md">
            + New Project
          </Button>
        </Link>
      </div>

      {/* Projects List */}
      <div className="bg-white rounded-2xl border border-ink/10 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12">
            <LoadingState message="Loading projects..." />
          </div>
        ) : projects.length === 0 ? (
          <div className="p-16 text-center text-ink-muted">
            <span className="text-4xl block mb-3">🎨</span>
            <p className="text-base font-semibold text-ink">No projects created yet</p>
            <p className="text-xs text-ink-muted mt-1 max-w-sm mx-auto">
              Get started by adding your first project to display your logos, brand boards, social creatives, or thumbnails.
            </p>
            <Link to="/admin/projects/new" className="inline-block mt-5">
              <Button variant="primary" size="sm">
                Create First Project
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-ink/5 text-ink-muted text-xs uppercase tracking-wider font-mono">
                <tr>
                  <th className="py-3 px-6">Project Title & Cover</th>
                  <th className="py-3 px-6">Category</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Featured</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-ink/[0.02] transition-colors">
                    {/* Project Title */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-ink/5 shrink-0 border border-ink/10">
                          {project.cover_image ? (
                            <img
                              src={project.cover_image}
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-xs text-ink/30">
                              {project.title.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-ink leading-tight">{project.title}</p>
                          <span className="text-xs text-ink-muted font-mono block mt-0.5">
                            /{project.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-6 text-xs text-ink-muted">
                      {project.category?.name || 'Unassigned'}
                    </td>

                    {/* Status Toggle */}
                    <td className="py-4 px-6">
                      <button
                        onClick={() => togglePublished(project)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                          project.published
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        }`}
                      >
                        {project.published ? '● Live' : '○ Draft'}
                      </button>
                    </td>

                    {/* Featured Star */}
                    <td className="py-4 px-6">
                      <button
                        onClick={() => toggleFeatured(project)}
                        className={`text-lg transition-transform hover:scale-125 ${
                          project.featured ? 'text-amber-400' : 'text-ink/20 hover:text-ink/40'
                        }`}
                        title={project.featured ? 'Featured on homepage' : 'Not featured'}
                      >
                        ★
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right space-x-2">
                      <Link
                        to={`/admin/projects/${project.id}/edit`}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-ink bg-ink/5 hover:bg-ink hover:text-white transition-all inline-block"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(project)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white transition-all inline-block"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Project"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"? This will remove its images and case study.`}
        confirmLabel="Delete Permanently"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

