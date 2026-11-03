import { motion } from 'framer-motion'
import Container from '@/components/common/Container'
import type { Profile } from '@/types'

interface AboutSectionProps {
  content?: Record<string, string>
  profile?: Profile | null
}

export default function AboutSection({ content, profile }: AboutSectionProps) {
  const heading = content?.heading || 'Design that creates recall, builds trust, and drives emotion.'
  const description =
    content?.description ||
    profile?.bio ||
    "I'm Yash Chourey — an obsessive graphic designer and visual identity architect. I help bold creators, startups, and established enterprises craft iconic visual systems, social media powerhouses, and memorable brand footprints. Every stroke, color token, and curve is engineered with intent."

  return (
    <section id="about" className="py-20 md:py-28 bg-paper">
      <Container>
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Heading */}
          <div className="lg:col-span-5">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-ink leading-tight">
              {heading}
            </h2>

            <div className="mt-8 pt-8 border-t border-ink/10 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-ink/10 border-2 border-accent shrink-0">
                <img
                  src="/hero.jpeg"
                  alt="Yash Chourey"
                  className="w-full h-full object-cover object-top filter grayscale contrast-125"
                />
              </div>
              <div>
                <p className="font-display font-semibold text-ink text-base">
                  {profile?.full_name || 'Yash Chourey'}
                </p>
                <p className="text-xs text-ink-muted">
                  {profile?.title || 'Graphic Designer'} • {profile?.location || 'India'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative & Metrics */}
          <div className="lg:col-span-7 space-y-6 text-base sm:text-lg text-ink/80 leading-relaxed font-normal">
            <p className="font-medium text-ink text-lg sm:text-xl leading-snug">
              Specialized across complete visual identity stacks: from brand guidelines and logomarks to high-converting social carousels, YouTube thumbnails, and high-impact marketing collateral.
            </p>
            <p>
              {description}
            </p>

            {/* Quick Metrics Grid in Mentality style */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6">
              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200/60">
                <span className="text-xs font-mono uppercase text-amber-800/80 font-medium">Deliverables</span>
                <p className="font-display text-3xl md:text-4xl font-bold text-ink mt-2">150+</p>
                <p className="text-xs text-ink-muted mt-1">Creative assets finalized</p>
              </div>

              <div className="p-5 rounded-2xl bg-sky-50 border border-sky-200/60">
                <span className="text-xs font-mono uppercase text-sky-800/80 font-medium">Logos & Brands</span>
                <p className="font-display text-3xl md:text-4xl font-bold text-ink mt-2">35+</p>
                <p className="text-xs text-ink-muted mt-1">Identities launched</p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200/60 col-span-2 sm:col-span-1">
                <span className="text-xs font-mono uppercase text-emerald-800/80 font-medium">Satisfaction</span>
                <p className="font-display text-3xl md:text-4xl font-bold text-ink mt-2">100%</p>
                <p className="text-xs text-ink-muted mt-1">Client commitment</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

