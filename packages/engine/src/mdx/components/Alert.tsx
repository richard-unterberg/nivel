import cm, { cmMerge } from '@classmatejs/react'
import { Check, CircleX, Info, TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'

export type AlertVariant = 'info' | 'warning' | 'error' | 'success'

const alertIconMap = {
  info: Info,
  warning: TriangleAlert,
  error: CircleX,
  success: Check,
}

export const Alert = ({
  type = 'info',
  heading,
  children,
  icon = true,
}: {
  type?: AlertVariant
  heading?: ReactNode
  children: ReactNode
  icon?: boolean | ReactNode
}) => {
  const AlertIcon = icon === true ? alertIconMap[type] : typeof icon === 'object' ? () => <>{icon}</> : null

  const alertIconTextColorClass = {
    info: 'text-info',
    warning: 'text-warning',
    error: 'text-error',
    success: 'text-success',
  }[type]

  return (
    <AlertOuter $variant={type}>
      {!!heading && AlertIcon && (
        <div className="mb-3 flex items-center gap-2">
          <AlertIcon className={cmMerge(alertIconTextColorClass, 'float-left h-5 w-5')} />
          <AlertHeading>{heading}</AlertHeading>
        </div>
      )}
      {!(!!heading && AlertIcon) && !!heading && <AlertHeading>{heading}</AlertHeading>}
      {!(!!heading && AlertIcon) && AlertIcon && (
        <div className={cmMerge(alertIconTextColorClass, 'float-left mr-2')}>
          <AlertIcon className="mt-1 h-5 w-5" />
        </div>
      )}
      {children}
    </AlertOuter>
  )
}

const AlertOuter = cm.section.variants<{ $variant: AlertVariant }>({
  base: `
    p-4
    my-6
    border
    rounded-lg
    prose-p:last:mb-0
    prose-p:mt-0
    prose-headings:first:mt-0
    prose-headings:last:mb-0
    prose-ul:first:mt-0
    prose-ul:last:mb-0
    text-sm
  `,
  variants: {
    $variant: {
      info: 'bg-info/10 border-info/30',
      warning: 'bg-warning/10 border-warning/30',
      error: 'bg-error/10 border-error/25',
      success: 'bg-success/10 border-success/35',
    },
  },
  defaultVariants: {
    $variant: 'info',
  },
})

const AlertHeading = cm.header`
  font-bold
  text-base
`
