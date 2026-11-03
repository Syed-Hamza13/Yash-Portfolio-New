import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/useMediaQuery'

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Portfolio', href: '/work' },
]

export default function Navbar() {
  const location = useLocation()
  const isMobile = useIsMobile()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Determine if we're on the homepage (hero has dark bg)
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const headerBg = scrolled
    ? 'bg-white/90 backdrop-blur-xl shadow-sm'
    : isHome
      ? 'bg-transparent'
      : 'bg-white/90 backdrop-blur-xl'

  const textColor = scrolled || !isHome ? 'text-ink' : 'text-white'

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled ? 'pt-0' : 'pt-2 sm:pt-3',
          headerBg
        )}
      >
        <div className="container-main flex items-center justify-between py-3 sm:py-3.5">
          {/* Logo */}
          <Link
            to="/"
            className={cn(
              'font-display font-bold text-xl tracking-tight transition-colors duration-300',
              textColor
            )}
          >
            Yash<span className="text-accent">.</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center">
            <div className={cn(
              'flex items-center gap-1 rounded-full p-1 transition-colors duration-300',
              scrolled || !isHome ? 'bg-ink/5' : 'bg-white/15 backdrop-blur-md'
            )}>
              {navItems.map((item) => {
                const isActive = item.href === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.href)

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      'relative px-5 py-2 text-sm font-medium rounded-full transition-colors duration-300',
                      isActive
                        ? scrolled || !isHome ? 'text-white' : 'text-ink'
                        : scrolled || !isHome ? 'text-ink/70 hover:text-ink' : 'text-white/80 hover:text-white'
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicator"
                        className={cn(
                          'absolute inset-0 rounded-full',
                          scrolled || !isHome ? 'bg-ink' : 'bg-white'
                        )}
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Link
              to="/#contact"
              className={cn(
                'hidden sm:inline-flex text-sm font-medium px-5 py-2 rounded-full transition-all duration-300',
                scrolled || !isHome
                  ? 'bg-accent text-white hover:bg-accent-dark'
                  : 'bg-white/90 text-ink hover:bg-white'
              )}
            >
              Let's Talk
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={cn('md:hidden p-2 rounded-lg transition-colors', textColor)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span className={cn(
                  'block h-0.5 rounded-full transition-all duration-300 origin-center',
                  scrolled || !isHome ? 'bg-ink' : 'bg-white',
                  mobileOpen && 'rotate-45 translate-y-[9px]'
                )} />
                <span className={cn(
                  'block h-0.5 rounded-full transition-all duration-300',
                  scrolled || !isHome ? 'bg-ink' : 'bg-white',
                  mobileOpen && 'opacity-0 scale-0'
                )} />
                <span className={cn(
                  'block h-0.5 rounded-full transition-all duration-300 origin-center',
                  scrolled || !isHome ? 'bg-ink' : 'bg-white',
                  mobileOpen && '-rotate-45 -translate-y-[9px]'
                )} />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-ink/95 backdrop-blur-xl md:hidden"
          >
            <nav className="flex flex-col items-center justify-center h-full gap-2">
              {navItems.map((item, i) => {
                const isActive = item.href === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.href)

                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                  >
                    <Link
                      to={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'block text-4xl font-display font-semibold py-3 transition-colors',
                        isActive ? 'text-accent' : 'text-white/70 hover:text-white'
                      )}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                )
              })}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="mt-8"
              >
                <Link
                  to="/#contact"
                  onClick={() => setMobileOpen(false)}
                  className="bg-accent text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-accent-dark transition-colors"
                >
                  Let's Talk
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
