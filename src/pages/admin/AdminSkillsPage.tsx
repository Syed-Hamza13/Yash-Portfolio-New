import { useState, useEffect, type FormEvent } from 'react'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Select from '@/components/common/Select'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import LoadingState from '@/components/common/LoadingState'
import { getSkills, createSkill, updateSkill, deleteSkill } from '@/services/content'
import type { Skill } from '@/types'

const CATEGORY_OPTIONS = [
  { value: 'Design Strategy', label: 'Design Strategy' },
  { value: 'Software & Tools', label: 'Software & Tools' },
  { value: 'Growth & Content', label: 'Growth & Content' },
  { value: 'Art Direction', label: 'Art Direction' },
  { value: 'General', label: 'General' },
]

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Skill | null>(null)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState<Partial<Skill>>({
    name: '',
    category: 'Software & Tools',
    proficiency: 90,
    display_order: 0,
  })

  const loadData = async () => {
    try {
      setLoading(true)
      const data = await getSkills()
      setSkills(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleStartEdit = (skill: Skill) => {
    setEditingId(skill.id)
    setForm(skill)
  }

  const handleCancel = () => {
    setEditingId(null)
    setForm({
      name: '',
      category: 'Software & Tools',
      proficiency: 90,
      display_order: 0,
    })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.name) return
    setSaving(true)

    try {
      if (editingId) {
        await updateSkill(editingId, form)
      } else {
        await createSkill(form)
      }
      handleCancel()
      await loadData()
    } catch (err) {
      alert('Failed to save skill: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteSkill(deleteTarget.id)
      setDeleteTarget(null)
      await loadData()
    } catch (err) {
      alert('Failed to delete skill: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">
          Skills & Technical Expertise
        </h1>
        <p className="text-sm text-ink-muted mt-1">
          Manage your design software proficiency, creative disciplines, and output capabilities.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Form */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-7 border border-ink/10 shadow-sm">
          <h2 className="font-display font-bold text-lg text-ink mb-4 pb-2 border-b border-ink/5">
            {editingId ? 'Edit Skill' : 'Add New Skill'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Skill / Tool Name *"
              placeholder="e.g. Adobe Illustrator"
              value={form.name || ''}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            <Select
              label="Skill Category"
              value={form.category || 'Software & Tools'}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              options={CATEGORY_OPTIONS}
            />

            <div>
              <div className="flex justify-between items-center text-xs font-medium text-ink mb-1.5">
                <label>Proficiency Level</label>
                <span className="font-mono text-accent font-bold">{form.proficiency || 90}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={form.proficiency || 90}
                onChange={(e) => setForm({ ...form, proficiency: parseInt(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <Input
              label="Display Order"
              type="number"
              value={form.display_order ?? 0}
              onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
            />

            <div className="flex gap-2 pt-2">
              <Button type="submit" variant="primary" loading={saving} className="flex-1">
                {editingId ? 'Update Skill' : 'Add Skill'}
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
              Configured Skills ({skills.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-8">
              <LoadingState message="Loading skills..." />
            </div>
          ) : skills.length === 0 ? (
            <div className="p-8 text-center text-ink-muted text-sm">
              No skills configured yet. Add your primary tools and disciplines using the form.
            </div>
          ) : (
            <div className="divide-y divide-ink/5">
              {skills.map((skill) => (
                <div key={skill.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-ink/[0.02]">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-ink text-sm sm:text-base">{skill.name}</h3>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-ink/5 text-ink-muted">
                        {skill.category}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center gap-3 max-w-xs">
                      <div className="h-1.5 flex-1 bg-ink/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent rounded-full"
                          style={{ width: `${skill.proficiency}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-ink-muted shrink-0">
                        {skill.proficiency}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleStartEdit(skill)}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-ink/5 hover:bg-ink hover:text-white transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(skill)}
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
        title="Delete Skill"
        message={`Delete "${deleteTarget?.name}"?`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

