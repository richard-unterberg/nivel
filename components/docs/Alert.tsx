import cm from '@classmatejs/react'

type AlertVariant = 'info' | 'warning' | 'error' | 'success'

export const Alert = ({
  type = 'info',
  heading,
  children,
}: {
  type?: AlertVariant
  heading?: React.ReactNode
  children: React.ReactNode
}) => {
  return (
    <AlertOuter $variant={type}>
      {heading && <AlertHeading>{heading}</AlertHeading>}
      {children}
    </AlertOuter>
  )
}

const AlertOuter = cm.section.variants<{ $variant: AlertVariant }>({
  base: `
    p-3
    mb-3
    border
    rounded-lg
    prose-p:my-0
    alert
  `,
  variants: {
    $variant: {
      info: 'bg-info/5 border-info/20',
      warning: 'bg-warning/5 border-warning/30',
      error: 'bg-error/5 border-error/25',
      success: 'bg-success/5 border-success/30',
    },
  },
  defaultVariants: {
    $variant: 'info',
  },
})

const AlertHeading = cm.header`
  mt-3
  font-bold
  text-base
  mb-5
`
