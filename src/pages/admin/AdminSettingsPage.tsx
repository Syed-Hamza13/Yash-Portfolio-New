import { useState, useEffect, type FormEvent } from 'react'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import LoadingState from '@/components/common/LoadingState'
import { getProfile, updateProfile, getSocialLinks, createSocialLink, updateSocialLink, deleteSocialLink } from '@/services/content'
import type { Profile, SocialLink } from '@/types'

export default function AdminSettingsPage() {
  const [profile, setProfile] = useState<Partial<Profile>>({})
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [loading, setLoading] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)

  // Social link creation form
  const [newPlatform, setNewPlatform] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [addingSocial, setAddingSocial] = useState(false)

  const loadData = async () => {
    try {
      setLoading(true)
      const [p, s] = await Promise.all([
        getProfile(),
        getSocialLinks()
      ])
      if (p) setProfile(p)
      setSocialLinks(s)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!profile.id) return
    setSavingProfile(true)
    setProfileSaved(false)

    try {
      await updateProfile(profile.id, profile)
      setProfileSaved(true)
      setTimeout(() => setProfileSaved(false), 3000)
    } catch (err) {
      alert('Failed to save profile: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setSavingProfile(false)
    }
  }

  const handleAddSocial = async (e: FormEvent) => {
    e.preventDefault()
    if (!newPlatform || !newUrl) return
    setAddingSocial(true)

    try {
      await createSocialLink({
        platform: newPlatform,
        url: newUrl,
        display_order: socialLinks.length + 1,
      })
      setNewPlatform('')
      setNewUrl('')
      const links = await getSocialLinks()
      setSocialLinks(links)
    } catch (err) {
      alert('Failed to add social link: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setAddingSocial(false)
    }
  }

  const handleDeleteSocial = async (id: string) => {
    try {
      await deleteSocialLink(id)
      setSocialLinks(socialLinks.filter((l) => l.id !== id))
    } catch (err) {
      alert('Failed to delete social link: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  if (loading) return <LoadingState message="Loading settings..." />

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">
          Profile & Social Settings
        </h1>
        <p className="text-sm text-ink-muted mt-1">
          Manage your personal contact details, portfolio title, and online profiles.
        </p>
      </div>

      {/* Profile Details Form */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-ink/10 shadow-sm space-y-6">
        <h2 className="font-display font-bold text-lg text-ink pb-2 border-b border-ink/5">
          Personal Information
        </h2>

        {profileSaved && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
            ✓ Profile updated successfully!
          </div>
        )}

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={profile.full_name || ''}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              required
            />

            <Input
              label="Professional Title"
              value={profile.title || ''}
              onChange={(e) => setProfile({ ...profile, title: e.target.value })}
              required
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <Input
              label="Public Contact Email"
              type="email"
              value={profile.email || ''}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              required
            />

            <Input
              label="Phone / WhatsApp"
              value={profile.phone || ''}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />

            <Input
              label="Location"
              value={profile.location || ''}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" loading={savingProfile}>
              Save Profile Details
            </Button>
          </div>
        </form>
      </div>

      {/* Social Links Manager */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-ink/10 shadow-sm space-y-6">
        <h2 className="font-display font-bold text-lg text-ink pb-2 border-b border-ink/5">
          Social & Portfolio Links
        </h2>

        <form onSubmit={handleAddSocial} className="grid sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-4">
            <Input
              label="Platform"
              placeholder="e.g. Behance"
              value={newPlatform}
              onChange={(e) => setNewPlatform(e.target.value)}
              required
            />
          </div>

          <div className="sm:col-span-6">
            <Input
              label="URL"
              placeholder="https://behance.net/yashchourey"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              required
            />
          </div>

          <div className="sm:col-span-2">
            <Button type="submit" variant="primary" className="w-full" loading={addingSocial}>
              + Add
            </Button>
          </div>
        </form>

        <div className="pt-4 divide-y divide-ink/5">
          {socialLinks.map((link) => (
            <div key={link.id} className="py-3 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-sm text-ink">{link.platform}</p>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono text-accent hover:underline"
                >
                  {link.url} ↗
                </a>
              </div>

              <button
                type="button"
                onClick={() => handleDeleteSocial(link.id)}
                className="text-xs text-error hover:underline px-2 py-1"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

