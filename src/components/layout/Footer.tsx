import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Container from '@/components/common/Container'
import type { SocialLink } from '@/types'

interface FooterProps {
  footerText?: string
  socialLinks?: SocialLink[]
  email?: string
}

const socialIcons: Record<string, string> = {
  instagram: '📷',
  behance: '🅱️',
  linkedin: '💼',
  dribbble: '🏀',
  twitter: '𝕏',
  github: '💻',
  youtube: '▶️',
  facebook: '📘',
}

export default function Footer({ footerText, socialLinks = [], email }: FooterProps) {
  return (
    <footer className="bg-ink text-white rounded-t-[28px] mt-8">
      {/* Large brand text */}
      <div className="pt-16 pb-8 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
          className="text-center"
        >
          <p className="text-white/50 text-sm mb-4">Ready to collaborate?</p>
          {email && (
            <a
              href={`mailto:${email}`}
              className="font-display font-bold tracking-tight leading-none text-center block hover:text-accent transition-colors duration-300"
              style={{ fontSize: 'clamp(2rem, 8vw, 5rem)' }}
            >
              {email}
            </a>
          )}
        </motion.div>
      </div>

      <Container>
        <div className="border-t border-white/10 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors text-sm font-medium"
                aria-label={link.platform}
              >
                {link.platform}
              </a>
            ))}
          </div>

          {/* Quick Links */}
          <div className="flex items-center gap-6 text-sm text-white/60">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <Link to="/work" className="hover:text-white transition-colors">Portfolio</Link>
          </div>
        </div>

        {/* Large footer brand */}
        <div className="pb-8">
          <div
            className="font-display font-bold tracking-tighter leading-none text-center text-white/5 select-none"
            style={{ fontSize: 'clamp(3rem, 16vw, 14rem)' }}
          >
            Yash.
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 py-6 text-center text-sm text-white/40">
          {footerText || `© ${new Date().getFullYear()} Yash Chourey. All rights reserved.`}
        </div>
      </Container>
    </footer>
  )
}
