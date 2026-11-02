import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useSiteData } from '@/hooks/useSiteData'
import LoadingState from '@/components/common/LoadingState'

export default function PublicLayout() {
  const location = useLocation()
  const { profile, content, socialLinks, loading } = useSiteData()

  // Scroll to top on route change (unless hash link)
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [location.pathname])

  // Handle hash navigation
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash)
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
      }
    }
  }, [location.hash])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState message="Loading portfolio..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Outlet context={{ profile, content, socialLinks }} />
      </main>
      <Footer
        footerText={content?.footer?.text}
        socialLinks={socialLinks}
        email={profile?.email}
      />
    </div>
  )
}
