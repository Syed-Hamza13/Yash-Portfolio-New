import { useState, useEffect, type FormEvent } from 'react'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import LoadingState from '@/components/common/LoadingState'
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/services/content'
import { slugify } from '@/lib/utils'
import type { Category } from '@/types'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    display_order: 0,
  })

  const loadData = async () => {
    try {
      setLoading(true)
      const data = await getCategories()
      setCategories(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleNameChange = (name: string) => {
    setForm({
      ...form,
      name,
      slug: editingId ? form.slug : slugify(name),
    })
  }

  const handleStartEdit = (cat: Category) => {
    setEditingId(cat.id)
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      display_order: cat.display_order,
    })
  }

  const handleCancel = () => {
    setEditingId(null)
    setForm({ name: '', slug: '', description: '', display_order: 0 })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.slug) return
    setSaving(true)

    try {
      if (editingId) {
        await updateCategory(editingId, form)
      } else {
        await createCategory(form)
      }
      handleCancel()
      await loadData()
    } catch (err) {
      alert('Failed to save category: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteCategory(deleteTarget.id)
      setDeleteTarget(null)
      await loadData()
    } catch (err) {
      alert('Failed to delete category: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">
          Portfolio Categories
        </h1>
        <p className="text-sm text-ink-muted mt-1">
          Organize your creative disciplines: Logo Design, Branding, Social Media, Thumbnails, A+ Content, Banners.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Category Form */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-7 border border-ink/10 shadow-sm">
          <h2 className="font-display font-bold text-lg text-ink mb-4 pb-2 border-b border-ink/5">
            {editingId ? 'Edit Category' : 'Create New Category'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Category Name *"
              placeholder="e.g. Social Media Creatives"
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
            />

            <Input
              label="URL Slug *"
              placeholder="e.g. social-media"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
              required
            />

            <Input
              label="Description / Purpose"
              placeholder="Brief sentence shown above project grids..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <Input
              label="Display Order"
              type="number"
              value={form.display_order}
              onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
            />

            <div className="flex gap-2 pt-2">
              <Button type="submit" variant="primary" loading={saving} className="flex-1">
                {editingId ? 'Update Category' : 'Add Category'}
              </Button>
              {editingId && (
                <Button type="button" variant="ghost" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Existing Categories */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-ink/10 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-ink/10">
            <h2 className="font-display font-bold text-lg text-ink">
              Current Categories ({categories.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-8">
              <LoadingState message="Loading categories..." />
            </div>
          ) : categories.length === 0 ? (
            <div className="p-8 text-center text-ink-muted text-sm">
              No categories configured. Add one using the form.
            </div>
          ) : (
            <div className="divide-y divide-ink/5">
              {categories.map((cat) => (
                <div key={cat.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-ink/[0.02]">
                  <div>
                    <h3 className="font-semibold text-ink text-sm sm:text-base">
                      {cat.name}
                    </h3>
                    <p className="text-xs font-mono text-accent">/{cat.slug}</p>
                    {cat.description && (
                      <p className="text-xs text-ink-muted mt-1">{cat.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleStartEdit(cat)}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-ink/5 hover:bg-ink hover:text-white transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(cat)}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-red-50 text-error hover:bg-error hover:text-white transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Category"
        message={`Delete "${deleteTarget?.name}"? Projects assigned to this category will become unassigned.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

