import { useOutletContext } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import HeroSection from '@/components/portfolio/HeroSection'
import AboutSection from '@/components/portfolio/AboutSection'
import FeaturedWork from '@/components/portfolio/FeaturedWork'
import ExperienceSection from '@/components/portfolio/ExperienceSection'
import EducationSection from '@/components/portfolio/EducationSection'
import SkillsSection from '@/components/portfolio/SkillsSection'
import ContactSection from '@/components/portfolio/ContactSection'
import type { Profile, SocialLink } from '@/types'

interface ContextData {
  profile: Profile | null
  content: Record<string, Record<string, string>>
  socialLinks: SocialLink[]
}

export default function HomePage() {
  const { profile, content, socialLinks } = useOutletContext<ContextData>()

  return (
    <>
      <Helmet>
        <title>{profile?.full_name || 'Yash Chourey'} — Graphic Designer & Visual Brand Strategist</title>
        <meta
          name="description"
          content={content?.hero?.subheading || 'Crafting iconic brand identities, social creative architectures, and visual design.'}
        />
        <meta property="og:title" content={`${profile?.full_name || 'Yash Chourey'} — Graphic Designer`} />
        <meta property="og:description" content="Portfolio of Yash Chourey: Branding, Logos, Social Creatives, Thumbnails, and Banners." />
        <meta property="og:image" content="/hero.jpeg" />
      </Helmet>

      {/* Hero */}
      <HeroSection content={content?.hero} profile={profile} />

      {/* About */}
      <AboutSection content={content?.about} profile={profile} />

      {/* Featured Works */}
      <FeaturedWork />

      {/* Experience */}
      <ExperienceSection />

      {/* Education */}
      <EducationSection />

      {/* Skills */}
      <SkillsSection />

      {/* Contact Form with Web3Forms */}
      <ContactSection content={content?.contact} profile={profile} socialLinks={socialLinks} />
    </>
  )
}

