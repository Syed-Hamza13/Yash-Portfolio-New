import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { useIsMobile } from '@/hooks/useMediaQuery'

const adminNav = [
  { label: 'Dashboard', href: '/admin', icon: '📊' },
  { label: 'Projects', href: '/admin/projects', icon: '🎨' },
  { label: 'Categories', href: '/admin/categories', icon: '📁' },
  { label: 'Experience', href: '/admin/experience', icon: '💼' },
  { label: 'Education', href: '/admin/education', icon: '🎓' },
  { label: 'Skills', href: '/admin/skills', icon: '⚡' },
  { label: 'Site Content', href: '/admin/content', icon: '📝' },
  { label: 'Settings', href: '/admin/settings', icon: '⚙️' },
]

export default function AdminLayout() {
  const { signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login')
  }

  const isActive = (href: string) => {
    if (href === '/admin') return location.pathname === '/admin'
    return location.pathname.startsWith(href)
  }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-ink/10">
        <Link to="/admin" className="font-display font-bold text-xl text-ink">
          Yash<span className="text-accent">.</span>
          <span className="text-xs font-body font-normal text-ink-muted ml-2">Admin</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {adminNav.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            onClick={() => isMobile && setSidebarOpen(false)}
            className={cn(
              'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
              isActive(item.href)
                ? 'bg-accent/10 text-accent'
                : 'text-ink-muted hover:text-ink hover:bg-ink/5'
            )}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-ink/10 space-y-2">
        <Link
          to="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-ink-muted hover:text-ink hover:bg-ink/5 transition-colors"
        >
          <span>🌐</span> View Site
        </Link>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-error hover:bg-error/5 transition-colors w-full text-left"
        >
          <span>🚪</span> Sign Out
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-paper flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-ink/10 fixed inset-y-0 left-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-72 bg-white h-full flex flex-col shadow-xl z-50">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 md:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-ink/10">
          <div className="flex items-center justify-between px-4 md:px-8 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-ink/5"
              aria-label="Open sidebar"
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <span className="block h-0.5 bg-ink rounded" />
                <span className="block h-0.5 bg-ink rounded w-3/4" />
                <span className="block h-0.5 bg-ink rounded" />
              </div>
            </button>
            <div className="text-sm text-ink-muted">
              {adminNav.find(n => isActive(n.href))?.label || 'Admin'}
            </div>
            <div />
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
