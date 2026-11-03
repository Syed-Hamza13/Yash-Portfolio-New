import { useState, useEffect } from 'react'
import Container from '@/components/common/Container'
import { getSkills } from '@/services/content'
import type { Skill } from '@/types'

const FALLBACK_SKILLS: Skill[] = [
  { id: 's1', name: 'Brand Identity & Guidelines', category: 'Design Strategy', proficiency: 98, display_order: 1, created_at: '' },
  { id: 's2', name: 'Logomark & Typographic Design', category: 'Design Strategy', proficiency: 95, display_order: 2, created_at: '' },
  { id: 's3', name: 'Packaging & Print Architecture', category: 'Design Strategy', proficiency: 90, display_order: 3, created_at: '' },
  
  { id: 's4', name: 'Adobe Photoshop', category: 'Software & Tools', proficiency: 98, display_order: 4, created_at: '' },
  { id: 's5', name: 'Adobe Illustrator', category: 'Software & Tools', proficiency: 96, display_order: 5, created_at: '' },
  { id: 's6', name: 'Figma', category: 'Software & Tools', proficiency: 92, display_order: 6, created_at: '' },
  { id: 's7', name: 'Adobe After Effects', category: 'Software & Tools', proficiency: 82, display_order: 7, created_at: '' },

  { id: 's8', name: 'Social Media Creatives & Carousels', category: 'Growth & Content', proficiency: 96, display_order: 8, created_at: '' },
  { id: 's9', name: 'High-CTR YouTube Thumbnails', category: 'Growth & Content', proficiency: 94, display_order: 9, created_at: '' },
  { id: 's10', name: 'Amazon A+ Content & Banners', category: 'Growth & Content', proficiency: 92, display_order: 10, created_at: '' }
]

export default function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>([])

  useEffect(() => {
    getSkills()
      .then((data) => {
        if (data && data.length > 0) setSkills(data)
        else setSkills(FALLBACK_SKILLS)
      })
      .catch(() => setSkills(FALLBACK_SKILLS))
  }, [])

  // Group skills by category
  const categories = Array.from(new Set(skills.map(s => s.category || 'Expertise')))

  return (
    <section id="skills" className="py-20 md:py-28 bg-ink text-white">
      <Container>
        <div className="max-w-3xl mb-14">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            Craft, Tools & Disciplines
          </h2>
          <p className="text-sm text-white/60 mt-3 leading-relaxed">
            Meticulously honed expertise across commercial design software, artistic principles, and high-conversion commercial media.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <div key={cat} className="p-7 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <div>
                <h3 className="font-display font-semibold text-lg text-white mb-6 pb-3 border-b border-white/10 flex items-center justify-between">
                  <span>{cat}</span>
                  <span className="text-xs font-mono text-amber-400">⚡</span>
                </h3>

                <div className="space-y-5">
                  {skills
                    .filter(s => (s.category || 'Expertise') === cat)
                    .map((skill) => (
                      <div key={skill.id}>
                        <div className="flex justify-between items-center text-xs font-medium mb-2">
                          <span className="text-white/90">{skill.name}</span>
                          <span className="font-mono text-amber-400">{skill.proficiency}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-1000"
                            style={{ width: `${skill.proficiency}%` }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/5 text-[11px] font-mono text-white/40 uppercase tracking-widest text-right">
                Production Ready
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

