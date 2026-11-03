import { useState, useEffect } from 'react'
import Container from '@/components/common/Container'
import { getExperience } from '@/services/content'
import type { Experience } from '@/types'

const FALLBACK_EXPERIENCE: Experience[] = [
  {
    id: 'e1',
    company: 'Stellar Brand Labs',
    position: 'Lead Graphic & Visual Identity Designer',
    description: 'Directed art direction across 20+ branding campaigns, created modular design token libraries, and oversaw brand guidelines for emerging global D2C and SaaS clients.',
    start_date: '2023-01-01',
    end_date: null,
    current: true,
    display_order: 1,
    created_at: ''
  },
  {
    id: 'e2',
    company: 'PixelCraft Creative Agency',
    position: 'Senior Visual Designer',
    description: 'Produced multi-channel advertising creatives, packaging design prototypes, pitch decks, and high-engagement social campaigns generating 40%+ CTR improvements.',
    start_date: '2021-06-01',
    end_date: '2022-12-31',
    current: false,
    display_order: 2,
    created_at: ''
  },
  {
    id: 'e3',
    company: 'Studio Monochrome',
    position: 'Brand & Graphic Designer',
    description: 'Developed bespoke logomarks, typography pairings, vector illustration systems, and print collateral for luxury hospitality and culinary clients.',
    start_date: '2020-03-01',
    end_date: '2021-05-31',
    current: false,
    display_order: 3,
    created_at: ''
  }
]

export default function ExperienceSection() {
  const [experience, setExperience] = useState<Experience[]>([])

  useEffect(() => {
    getExperience()
      .then((data) => {
        if (data && data.length > 0) setExperience(data)
        else setExperience(FALLBACK_EXPERIENCE)
      })
      .catch(() => setExperience(FALLBACK_EXPERIENCE))
  }, [])

  return (
    <section id="experience" className="py-20 md:py-28 bg-paper">
      <Container>
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-4">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink leading-tight">
              Work Experience & Roles
            </h2>
            <p className="text-sm text-ink-muted mt-4 leading-relaxed">
              Proven track record delivering exceptional visual craftsmanship across brand studios, agencies, and high-velocity product teams.
            </p>
          </div>

          <div className="lg:col-span-8 space-y-8">
            {experience.map((item) => (
              <div
                key={item.id}
                className="p-6 sm:p-8 rounded-2xl bg-white border border-ink/5 shadow-sm hover:border-ink/15 transition-all group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-display text-xl font-bold text-ink group-hover:text-amber-600 transition-colors">
                      {item.position}
                    </h3>
                    <p className="text-sm font-semibold text-accent mt-0.5">
                      {item.company}
                    </p>
                  </div>
                  <span className="inline-block px-3 py-1 rounded-full bg-ink/5 text-ink text-xs font-mono font-medium self-start sm:self-auto">
                    {new Date(item.start_date).getFullYear()} — {item.current ? 'Present' : item.end_date ? new Date(item.end_date).getFullYear() : 'Present'}
                  </span>
                </div>

                {item.description && (
                  <p className="text-sm text-ink-muted mt-4 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

