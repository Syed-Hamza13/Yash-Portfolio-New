import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import Input from '@/components/common/Input'
import Textarea from '@/components/common/Textarea'
import Select from '@/components/common/Select'
import Toggle from '@/components/common/Toggle'
import Button from '@/components/common/Button'
import ImageUpload from '@/components/common/ImageUpload'
import LoadingState from '@/components/common/LoadingState'
import { getProjectById, createProject, updateProject } from '@/services/projects'
import { getCategories } from '@/services/content'
import { slugify } from '@/lib/utils'
import type { Category, Project } from '@/types'

// Default preset categories matching ui.jpeg exactly
const PRESET_CATEGORIES = [
  { value: 'logos', label: '01 Logo Design (Square Marks)' },
  { value: 'branding', label: '02 Brand Boards (Stationery & Systems)' },
  { value: 'social', label: '03 Social Media Creatives (Phone Feed Posts)' },
  { value: 'thumbnails', label: '04 Thumbnails (16:9 Video Covers)' },
  { value: 'aplus', label: '05 A+ Content (Amazon Listing Modules)' },
  { value: 'banners', label: '06 Banners (Ultra-wide Website Banners)' },
]

export default function AdminProjectFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState<Partial<Project>>({
    title: '',
    slug: '',
    short_description: '',
    full_description: '',
    category_id: '',
    cover_image: '',
    client: '',
    year: new Date().getFullYear().toString(),
    services: '',
    featured: false,
    published: true,
    display_order: 0,
  })

  useEffect(() => {
    async function init() {
      try {
        const cats = await getCategories()
        setCategories(cats)

        if (isEditing && id) {
          const proj = await getProjectById(id)
          if (proj) {
            setForm(proj)
          } else {
            setError('Project not found')
          }
        } else if (cats.length > 0) {
          setForm((prev) => ({ ...prev, category_id: cats[0].id }))
        }
      } catch (err) {
        console.error(err)
        setError('Failed to load project details')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [id, isEditing])

  const handleTitleChange = (val: string) => {
    setForm((prev) => ({
      ...prev,
      title: val,
      slug: isEditing ? prev.slug : slugify(val),
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.slug) {
      setError('Title and URL slug are mandatory.')
      return
    }

    setSaving(true)
    setError(null)

    try {
      if (isEditing && id) {
        await updateProject(id, form)
      } else {
        await createProject(form)
      }
      navigate('/admin/projects')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save project.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <LoadingState message="Loading editor..." />
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-ink/10">
        <div>
          <Link
            to="/admin/projects"
            className="text-xs font-mono font-semibold text-ink-muted hover:text-ink uppercase tracking-wider mb-1 block"
          >
            ← Back to Projects
          </Link>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">
            {isEditing ? `Edit: ${form.title}` : 'Add New Portfolio Project'}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/admin/projects">
            <Button variant="ghost" size="sm">
              Cancel
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            loading={saving}
          >
            Save Project
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-error text-xs">
          {error}
        </div>
      )}

      {/* Form Grid */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-ink/10 shadow-sm space-y-5">
          <h2 className="font-display font-bold text-lg text-ink pb-2 border-b border-ink/5">
            Core Information & Section Assignment
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Project Title *"
              placeholder="e.g. Arion Luxury Fragrance Identity"
              value={form.title || ''}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
            />

            <Input
              label="URL Slug *"
              placeholder="e.g. arion-luxury-fragrance"
              value={form.slug || ''}
              onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
              helperText="Determines URL: /work/your-slug"
              required
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <Select
              label="Portfolio Category (Matching ui.jpeg Sections)"
              value={form.category_id || ''}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              options={
                categories.length > 0
                  ? categories.map((c) => ({ value: c.id, label: c.name }))
                  : PRESET_CATEGORIES
              }
            />

            <Input
              label="Client Name"
              placeholder="e.g. Arion Parfums"
              value={form.client || ''}
              onChange={(e) => setForm({ ...form, client: e.target.value })}
            />

            <Input
              label="Year"
              placeholder="e.g. 2026"
              value={form.year || ''}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
            />
          </div>

          <Input
            label="Services / Deliverables"
            placeholder="e.g. Visual Identity, Packaging, Art Direction, 3D Mockups"
            value={form.services || ''}
            onChange={(e) => setForm({ ...form, services: e.target.value })}
            helperText="Comma separated list shown on case study header"
          />

          <Textarea
            label="Short Summary"
            placeholder="1-2 sentences summarizing the visual achievement for grid cards."
            value={form.short_description || ''}
            onChange={(e) => setForm({ ...form, short_description: e.target.value })}
            rows={2}
          />

          <Textarea
            label="Full Case Study Story & Brief"
            placeholder="Detailed narrative describing the challenge, typography choices, color decisions, and results..."
            value={form.full_description || ''}
            onChange={(e) => setForm({ ...form, full_description: e.target.value })}
            rows={6}
          />
        </div>

        {/* Media & Artwork Upload with Real Upload */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-ink/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-ink/5">
            <h2 className="font-display font-bold text-lg text-ink">
              Project Cover Artwork
            </h2>
            <span className="text-xs font-mono text-accent">Supports PNG, JPG, WebP, SVG</span>
          </div>

          {/* Full Drag & Drop / Click Upload Component */}
          <ImageUpload
            label="Upload Image File (Supabase Storage / Local)"
            currentImage={form.cover_image || undefined}
            folder="portfolio-uploads"
            onUpload={(result) => setForm({ ...form, cover_image: result.url })}
            onError={(msg) => setError(msg)}
          />

          <div className="pt-2">
            <Input
              label="Or Direct Image Path / URL"
              placeholder="/portfolio-assets/logo_01_creative_studio.jpg or https://..."
              value={form.cover_image || ''}
              onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
              helperText="You can also paste direct URL or select one of the cropped assets in /portfolio-assets/ folder."
            />
          </div>

          {form.cover_image && (
            <div className="mt-4 p-3 rounded-xl bg-ink/5 flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-white shrink-0 border border-ink/10">
                <img src={form.cover_image} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <div className="text-xs text-ink-muted">
                <p className="font-semibold text-ink">Selected Artwork Active</p>
                <p className="truncate max-w-md font-mono">{form.cover_image}</p>
              </div>
            </div>
          )}
        </div>

        {/* Visibility & Ordering */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-ink/10 shadow-sm space-y-4">
          <h2 className="font-display font-bold text-lg text-ink pb-2 border-b border-ink/5">
            Publication Settings
          </h2>

          <div className="grid sm:grid-cols-2 gap-6 pt-2">
            <Toggle
              label="Publish to Website"
              description="Make this project publicly visible on your portfolio archive."
              checked={form.published ?? true}
              onChange={(checked) => setForm({ ...form, published: checked })}
            />

            <Toggle
              label="Feature on Homepage"
              description="Highlight this project in the top curated showcase section."
              checked={form.featured ?? false}
              onChange={(checked) => setForm({ ...form, featured: checked })}
            />
          </div>

          <div className="pt-4 max-w-xs">
            <Input
              label="Display Order"
              type="number"
              value={form.display_order ?? 0}
              onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
              helperText="Lower numbers appear first"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-4">
          <Link to="/admin/projects">
            <Button variant="ghost">Cancel</Button>
          </Link>
          <Button type="submit" variant="primary" size="lg" loading={saving}>
            {isEditing ? 'Save Changes' : 'Create Project'}
          </Button>
        </div>
      </form>
    </div>
  )
}
