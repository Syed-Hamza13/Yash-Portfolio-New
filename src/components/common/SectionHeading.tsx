import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface SectionHeadingProps {
  label?: string
  title: string
  titleAccent?: string
  description?: string
  align?: 'left' | 'center'
  className?: string
}

export default function SectionHeading({
  label,
  title,
  titleAccent,
  description,
  align = 'left',
  className,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
      className={cn(
        align === 'center' && 'text-center',
        'mb-12 md:mb-16',
        className
      )}
    >
      {label && (
        <p className="text-[11px] tracking-[0.2em] uppercase text-ink-muted mb-4 font-medium">
          {label}
        </p>
      )}
      <h2 className="font-display text-h2 font-semibold leading-[1.1] text-ink">
        {title}
        {titleAccent && (
          <>
            {' '}
            <span className="font-serif-italic text-[1.1em]">{titleAccent}</span>
          </>
        )}
      </h2>
      {description && (
        <p className="mt-4 text-ink-muted max-w-xl text-body leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  )
}
