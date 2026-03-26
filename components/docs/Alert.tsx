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
    p-4
    mb-5
    border
    rounded-lg
    prose-p:leading-7
    prose-p:last:mb-0
    prose-p:first:mt-0
    prose-headings:first:mt-0
    prose-headings:last:mb-0
    prose-ul:first:mt-0
    prose-ul:last:mb-0
    prose-div:my-0!
    text-sm
  `,
  variants: {
    $variant: {
      info: 'bg-info/5 border-info/30',
      warning: 'bg-warning/5 border-warning/30',
      error: 'bg-error/5 border-error/25',
      success: 'bg-success/5 border-success/35',
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
