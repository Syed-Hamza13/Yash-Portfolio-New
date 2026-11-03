import type { ReactNode, ElementType } from 'react'
import { cn } from '@/lib/utils'

interface ContainerProps {
  children: ReactNode
  narrow?: boolean
  className?: string
  as?: ElementType
}

export default function Container({
  children,
  narrow,
  className,
  as: Component = 'div',
}: ContainerProps) {
  return (
    <Component className={cn(narrow ? 'container-narrow' : 'container-main', className)}>
      {children}
    </Component>
  )
}
