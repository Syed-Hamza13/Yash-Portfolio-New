import { useState, useEffect } from 'react'
import Container from '@/components/common/Container'
import { getEducation } from '@/services/content'
import type { Education } from '@/types'

const FALLBACK_EDUCATION: Education[] = [
  {
    id: 'ed1',
    institution: 'National Institute of Design / Fine Arts Academy',
    degree: 'Bachelor of Design (Visual Communication)',
    description: 'In-depth focus on typography, color theory, semiotics, brand strategy, editorial layout, and visual identity systems.',
    start_date: '2017-08-01',
    end_date: '2021-05-31',
    current: false,
    display_order: 1,
    created_at: ''
  },
  {
    id: 'ed2',
    institution: 'Brand Master Academy',
    degree: 'Advanced Brand Identity & Strategic Design Specialization',
    description: 'Executive course on strategic brand positioning, architectural logomark systems, and commercial art direction.',
    start_date: '2022-01-01',
    end_date: '2022-06-30',
    current: false,
    display_order: 2,
    created_at: ''
  }
]

export default function EducationSection() {
  const [education, setEducation] = useState<Education[]>([])

  useEffect(() => {
    getEducation()
      .then((data) => {
        if (data && data.length > 0) setEducation(data)
        else setEducation(FALLBACK_EDUCATION)
      })
      .catch(() => setEducation(FALLBACK_EDUCATION))
  }, [])

  return (
    <section id="education" className="py-20 bg-paper-warm border-t border-ink/5">
      <Container>
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-4">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink leading-tight">
              Education & Credentials
            </h2>
            <p className="text-sm text-ink-muted mt-4 leading-relaxed">
              Academic grounding in design fundamentals combined with relentless real-world studio practice.
            </p>
          </div>

          <div className="lg:col-span-8 space-y-6">
            {education.map((item) => (
              <div
                key={item.id}
                className="p-6 sm:p-7 rounded-2xl bg-white border border-ink/5 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h3 className="font-display text-lg font-bold text-ink">
                    {item.degree}
                  </h3>
                  <span className="text-xs font-mono text-ink-muted">
                    {new Date(item.start_date).getFullYear()} — {item.end_date ? new Date(item.end_date).getFullYear() : 'Present'}
                  </span>
                </div>
                <p className="text-sm font-semibold text-accent mt-0.5">
                  {item.institution}
                </p>
                {item.description && (
                  <p className="text-sm text-ink-muted mt-3 leading-relaxed">
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

