import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { Profile } from '@/types'

interface HeroSectionProps {
  content?: Record<string, string>
  profile?: Profile | null
}

export default function HeroSection({ content, profile }: HeroSectionProps) {
  const heading = content?.heading || 'Crafting Visual Stories\n& Brand Identities.'
  const subheading = content?.subheading || profile?.title || 'Graphic Designer & Visual Artist'
  const ctaText = content?.cta_text || 'Explore Work'
  const ctaLink = content?.cta_link || '/work'

  return (
    <section className="p-1 sm:p-2 md:p-2.5">
      <div className="relative rounded-[24px] overflow-hidden min-h-[88vh] md:min-h-[94vh] flex flex-col justify-between p-6 sm:p-10 md:p-14 bg-ink shadow-2xl">
        {/* Background Image with Fixed-Feel Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-85 transition-transform duration-1000 scale-[1.01]"
          style={{
            backgroundImage: `url('/hero.jpeg')`,
            backgroundPosition: 'center 28%'
          }}
        />

        {/* Cinematic Dual Vignette & Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-ink/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-ink/20 to-ink/80" />

        {/* Top Spacer for Fixed Nav clearance */}
        <div className="relative z-10 pt-20 md:pt-24 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium text-white/90">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Open for select freelance & brand commissions</span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs uppercase tracking-widest text-white/60">
            <span>Identity</span>
            <span>•</span>
            <span>Packaging</span>
            <span>•</span>
            <span>Social</span>
            <span>•</span>
            <span>Campaigns</span>
          </div>
        </div>

        {/* Bottom Hero Content Stack */}
        <div className="relative z-10 mt-auto max-w-4xl pb-4 md:pb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
            className="mb-4"
          >
            <span className="text-amber-400 font-mono text-xs md:text-sm tracking-wider uppercase font-semibold">
              // {subheading}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.2, 0.7, 0.2, 1] }}
            className="font-display font-bold text-white text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.98] drop-shadow-md"
          >
            {heading.split('\n').map((line, idx) => (
              <span key={idx} className="block">
                {line}
              </span>
            ))}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Link
              to={ctaLink}
              className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-amber-400 text-ink font-semibold text-sm hover:bg-amber-300 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-amber-400/20"
            >
              <span>{ctaText}</span>
              <span className="grid place-items-center w-6 h-6 rounded-full bg-ink text-amber-400 text-xs">
                ↓
              </span>
            </Link>

            <a
              href="#about"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-medium text-sm transition-all border border-white/10"
            >
              <span>Learn About Yash</span>
              <span>→</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

