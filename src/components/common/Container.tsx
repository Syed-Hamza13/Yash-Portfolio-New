import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface ContainerProps {
  children: ReactNode
  narrow?: boolean
  className?: string
  as?: keyof JSX.IntrinsicElements
}

export default function Container({ children, narrow, className, as: Tag = 'div' }: ContainerProps) {
  return (
    <Tag className={cn(narrow ? 'container-narrow' : 'container-main', className)}>
      {children}
    </Tag>
  )
}
