import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  loading?: boolean
  icon?: ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', children, loading, icon, className, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
      primary: 'bg-ink text-white hover:bg-ink-light active:scale-[0.98]',
      secondary: 'bg-accent text-white hover:bg-accent-dark active:scale-[0.98]',
      outline: 'border-2 border-ink text-ink hover:bg-ink hover:text-white active:scale-[0.98]',
      ghost: 'text-ink hover:bg-ink/5 active:scale-[0.98]',
      danger: 'bg-error text-white hover:bg-red-700 active:scale-[0.98]',
    }

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-2.5 text-sm',
      lg: 'px-8 py-3 text-base',
    }

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : icon ? (
          icon
        ) : null}
        {children}
        {!loading && !icon && variant === 'primary' && (
          <span className="inline-grid place-items-center w-7 h-7 rounded-full bg-white/20 text-white transition-transform group-hover:translate-x-0.5">
            →
          </span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
export default Button
