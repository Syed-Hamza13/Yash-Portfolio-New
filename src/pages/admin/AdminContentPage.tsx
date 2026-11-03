import { useState, useEffect, type FormEvent } from 'react'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Textarea from '@/components/common/Textarea'
import LoadingState from '@/components/common/LoadingState'
import { getSiteContent, updateSiteContent } from '@/services/content'

export default function AdminContentPage() {
  const [content, setContent] = useState<Record<string, Record<string, string>>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    async function loadContent() {
      try {
        const data = await getSiteContent()
        setContent(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadContent()
  }, [])

  const handleChange = (section: string, key: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [key]: value,
      },
    }))
  }

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSuccess(false)

    try {
      const promises: Promise<void>[] = []
      for (const section in content) {
        for (const key in content[section]) {
          promises.push(updateSiteContent(section, key, content[section][key]))
        }
      }
      await Promise.all(promises)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      alert('Failed to update content: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingState message="Loading site content..." />

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-ink/10">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">
            Site Copy & Headings
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            Easily edit your hero headlines, about text, contact copy, and footer without code changes.
          </p>
        </div>

        <Button variant="primary" onClick={handleSave} loading={saving}>
          Save All Changes
        </Button>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium">
          ✓ Content updated successfully! Live website will reflect the changes immediately.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* HERO SECTION */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-ink/10 shadow-sm space-y-5">
          <h2 className="font-display font-bold text-lg text-ink flex items-center justify-between pb-2 border-b border-ink/5">
            <span>Hero Section</span>
            <span className="text-xs font-mono text-accent">Homepage Header</span>
          </h2>

          <Textarea
            label="Hero Main Heading (supports line breaks)"
            value={content.hero?.heading ?? 'Crafting Visual Stories\n& Brand Identities.'}
            onChange={(e) => handleChange('hero', 'heading', e.target.value)}
            rows={2}
          />

          <Input
            label="Subheading / Tagline"
            value={content.hero?.subheading ?? 'Graphic Designer & Visual Brand Strategist'}
            onChange={(e) => handleChange('hero', 'subheading', e.target.value)}
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Primary CTA Text"
              value={content.hero?.cta_text ?? 'Explore Work'}
              onChange={(e) => handleChange('hero', 'cta_text', e.target.value)}
            />
            <Input
              label="Primary CTA Destination"
              value={content.hero?.cta_link ?? '/work'}
              onChange={(e) => handleChange('hero', 'cta_link', e.target.value)}
            />
          </div>
        </div>

        {/* ABOUT SECTION */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-ink/10 shadow-sm space-y-5">
          <h2 className="font-display font-bold text-lg text-ink flex items-center justify-between pb-2 border-b border-ink/5">
            <span>About Section</span>
            <span className="text-xs font-mono text-accent">Biography & Philosophy</span>
          </h2>

          <Input
            label="About Heading"
            value={content.about?.heading ?? 'Design that creates recall, builds trust, and drives emotion.'}
            onChange={(e) => handleChange('about', 'heading', e.target.value)}
          />

          <Textarea
            label="Detailed Narrative Bio"
            value={
              content.about?.description ??
              "I'm Yash Chourey — an obsessive graphic designer and visual identity architect. I help bold creators, startups, and established enterprises craft iconic visual systems, social media powerhouses, and memorable brand footprints."
            }
            onChange={(e) => handleChange('about', 'description', e.target.value)}
            rows={5}
          />
        </div>

        {/* CONTACT SECTION */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-ink/10 shadow-sm space-y-5">
          <h2 className="font-display font-bold text-lg text-ink flex items-center justify-between pb-2 border-b border-ink/5">
            <span>Contact Section</span>
            <span className="text-xs font-mono text-accent">Call to Action</span>
          </h2>

          <Input
            label="Contact Heading"
            value={content.contact?.heading ?? "Let's build an unforgettable brand."}
            onChange={(e) => handleChange('contact', 'heading', e.target.value)}
          />

          <Textarea
            label="Contact Description"
            value={
              content.contact?.description ??
              "Whether you're launching a brand from scratch, redesigning your packaging, or looking for high-converting social creative assets — let's talk."
            }
            onChange={(e) => handleChange('contact', 'description', e.target.value)}
            rows={3}
          />
        </div>

        {/* FOOTER */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-ink/10 shadow-sm space-y-5">
          <h2 className="font-display font-bold text-lg text-ink flex items-center justify-between pb-2 border-b border-ink/5">
            <span>Footer</span>
            <span className="text-xs font-mono text-accent">Copyright & Tagline</span>
          </h2>

          <Input
            label="Footer Copyright Text"
            value={content.footer?.text ?? '© 2026 Yash Chourey. All rights reserved. Crafted with intent.'}
            onChange={(e) => handleChange('footer', 'text', e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="submit" variant="primary" size="lg" loading={saving}>
            Save All Changes
          </Button>
        </div>
      </form>
    </div>
  )
}

