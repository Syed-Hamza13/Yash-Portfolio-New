import { useState, useEffect, type FormEvent } from 'react'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Textarea from '@/components/common/Textarea'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import LoadingState from '@/components/common/LoadingState'
import { getEducation, createEducation, updateEducation, deleteEducation } from '@/services/content'
import type { Education } from '@/types'

export default function AdminEducationPage() {
  const [items, setItems] = useState<Education[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Education | null>(null)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState<Partial<Education>>({
    institution: '',
    degree: '',
    description: '',
    start_date: '',
    end_date: '',
    display_order: 0,
  })

  const loadData = async () => {
    try {
      setLoading(true)
      const data = await getEducation()
      setItems(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleStartEdit = (edu: Education) => {
    setEditingId(edu.id)
    setForm(edu)
  }

  const handleCancel = () => {
    setEditingId(null)
    setForm({
      institution: '',
      degree: '',
      description: '',
      start_date: '',
      end_date: '',
      display_order: 0,
    })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.institution || !form.degree || !form.start_date) return
    setSaving(true)

    try {
      if (editingId) {
        await updateEducation(editingId, form)
      } else {
        await createEducation(form)
      }
      handleCancel()
      await loadData()
    } catch (err) {
      alert('Failed to save education: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteEducation(deleteTarget.id)
      setDeleteTarget(null)
      await loadData()
    } catch (err) {
      alert('Failed to delete education: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">
          Education & Design Certifications
        </h1>
        <p className="text-sm text-ink-muted mt-1">
          Manage your design degrees, certificates, and academic pedigree.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Form */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-7 border border-ink/10 shadow-sm">
          <h2 className="font-display font-bold text-lg text-ink mb-4 pb-2 border-b border-ink/5">
            {editingId ? 'Edit Degree' : 'Add Degree / Certificate'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Institution / University / Academy *"
              placeholder="e.g. National Institute of Design"
              value={form.institution || ''}
              onChange={(e) => setForm({ ...form, institution: e.target.value })}
              required
            />

            <Input
              label="Degree / Major *"
              placeholder="e.g. Bachelor of Design (Visual Communication)"
              value={form.degree || ''}
              onChange={(e) => setForm({ ...form, degree: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Start Date *"
                type="date"
                value={form.start_date || ''}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                required
              />

              <Input
                label="End Date"
                type="date"
                value={form.end_date || ''}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              />
            </div>

            <Textarea
              label="Curriculum & Focus Areas"
              placeholder="Typography, semiotics, brand strategy, editorial layout..."
              value={form.description || ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
            />

            <Input
              label="Display Order"
              type="number"
              value={form.display_order ?? 0}
              onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
            />

            <div className="flex gap-2 pt-2">
              <Button type="submit" variant="primary" loading={saving} className="flex-1">
                {editingId ? 'Update Degree' : 'Add Degree'}
              </Button>
              {editingId && (
                <Button type="button" variant="ghost" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-ink/10 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-ink/10">
            <h2 className="font-display font-bold text-lg text-ink">
              Education List ({items.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-8">
              <LoadingState message="Loading education records..." />
            </div>
          ) : items.length === 0 ? (
            <div className="p-8 text-center text-ink-muted text-sm">
              No education records yet.
            </div>
          ) : (
            <div className="divide-y divide-ink/5">
              {items.map((item) => (
                <div key={item.id} className="p-5 flex items-start justify-between gap-4 hover:bg-ink/[0.02]">
                  <div>
                    <h3 className="font-semibold text-ink text-base">{item.degree}</h3>
                    <p className="text-sm font-medium text-accent">{item.institution}</p>
                    <p className="text-xs text-ink-muted font-mono mt-1">
                      {item.start_date} — {item.end_date || 'Present'}
                    </p>
                    {item.description && (
                      <p className="text-xs text-ink-muted mt-2 leading-relaxed max-w-lg">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleStartEdit(item)}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-ink/5 hover:bg-ink hover:text-white transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(item)}
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
        title="Delete Education"
        message={`Delete "${deleteTarget?.degree}" from ${deleteTarget?.institution}?`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

