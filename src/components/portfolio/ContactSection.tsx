import { useState, type FormEvent } from 'react'
import Container from '@/components/common/Container'
import Input from '@/components/common/Input'
import Textarea from '@/components/common/Textarea'
import Button from '@/components/common/Button'
import { isValidEmail } from '@/lib/utils'
import type { Profile, SocialLink } from '@/types'

const WEB3FORMS_ACCESS_KEY = '3a7ee953-cb3a-48a4-97e6-de3723e980c8'

interface ContactSectionProps {
  content?: Record<string, string>
  profile?: Profile | null
  socialLinks?: SocialLink[]
}

export default function ContactSection({ content, profile, socialLinks = [] }: ContactSectionProps) {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const heading = content?.heading || "Let's build an unforgettable brand."
  const description =
    content?.description ||
    "Whether you're launching a brand from scratch, redesigning your packaging, or looking for high-converting social creative assets — let's talk."

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'Please provide your name'
    if (!form.email.trim()) errs.email = 'Please provide your email'
    else if (!isValidEmail(form.email)) errs.email = 'Please provide a valid email'
    if (!form.message.trim()) errs.message = 'Please share a few details about your project'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setStatus('loading')
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name: form.name,
          email: form.email,
          message: form.message,
          subject: `New Portfolio Inquiry from ${form.name}`,
          from_name: 'Yash Chourey Portfolio',
        }),
      })

      const result = await response.json()
      if (result.success) {
        setStatus('success')
        setForm({ name: '', email: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="py-20 md:py-28 bg-paper">
      <Container>
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Direct Details */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-ink leading-tight">
                {heading}
              </h2>
              <p className="text-base text-ink-muted mt-4 leading-relaxed">
                {description}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-cream space-y-4">
              <div>
                <span className="text-xs font-mono uppercase text-ink-muted">Email Direct</span>
                <p className="mt-0.5">
                  <a
                    href={`mailto:${profile?.email || 'yashchourey.design@gmail.com'}`}
                    className="font-display font-bold text-lg text-ink hover:text-accent transition-colors"
                  >
                    {profile?.email || 'yashchourey.design@gmail.com'}
                  </a>
                </p>
              </div>

              {profile?.phone && (
                <div>
                  <span className="text-xs font-mono uppercase text-ink-muted">Phone / WhatsApp</span>
                  <p className="mt-0.5">
                    <a
                      href={`tel:${profile.phone}`}
                      className="font-display font-bold text-lg text-ink hover:text-accent transition-colors"
                    >
                      {profile.phone}
                    </a>
                  </p>
                </div>
              )}

              <div>
                <span className="text-xs font-mono uppercase text-ink-muted">Location</span>
                <p className="font-medium text-ink text-sm mt-0.5">
                  {profile?.location || 'Remote Worldwide / India'}
                </p>
              </div>
            </div>

            {socialLinks.length > 0 && (
              <div>
                <span className="text-xs font-mono uppercase text-ink-muted block mb-3">
                  Find Online
                </span>
                <div className="flex flex-wrap gap-2">
                  {socialLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-full border border-ink/15 text-xs font-medium text-ink hover:border-ink hover:bg-ink hover:text-white transition-all"
                    >
                      {link.platform} ↗
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-ink/10 shadow-lg">
              <h3 className="font-display text-2xl font-bold text-ink mb-6">
                Send a Message
              </h3>

              {status === 'success' ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto grid place-items-center text-xl font-bold">
                    ✓
                  </div>
                  <h4 className="font-display font-bold text-lg text-emerald-900">
                    Message Delivered
                  </h4>
                  <p className="text-sm text-emerald-800 leading-relaxed max-w-sm mx-auto">
                    Thank you! Your message was submitted successfully via Web3Forms. Yash will review and get back to you promptly.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => setStatus('idle')}
                  >
                    Send Another Note
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <Input
                    label="Full Name *"
                    placeholder="e.g. Jane Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    error={errors.name}
                  />

                  <Input
                    label="Email Address *"
                    type="email"
                    placeholder="e.g. jane@company.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    error={errors.email}
                  />

                  <Textarea
                    label="Project Scope & Details *"
                    placeholder="Tell me about your brand, timeline, requirements, or vision..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    error={errors.message}
                    rows={5}
                  />

                  {status === 'error' && (
                    <div className="p-4 rounded-xl bg-red-50 text-error text-xs">
                      Failed to submit message. Please try again or email directly.
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    loading={status === 'loading'}
                  >
                    Submit Project Inquiry
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

