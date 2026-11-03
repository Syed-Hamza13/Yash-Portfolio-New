import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '@/hooks/useAuth'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await signIn(email, password)
      navigate('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid credentials. Please verify your email and password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-4">
      <Helmet>
        <title>Admin Login — Yash Chourey CMS</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-ink/10 shadow-xl">
        <div className="text-center mb-8">
          <div className="inline-block px-3 py-1 rounded-full bg-accent/15 text-accent font-mono text-xs font-semibold mb-3">
            PORTFOLIO CMS
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">
            Admin Access
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-2">
            Sign in to manage projects, site headings, categories, and portfolio content.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-error text-xs leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email Address"
            type="email"
            placeholder="admin@yashchourey.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={loading}
          >
            Enter Admin Dashboard
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-ink/5 text-center text-xs text-ink-muted">
          Protected by Supabase Authentication & RLS Policies
        </div>
      </div>
    </div>
  )
}

