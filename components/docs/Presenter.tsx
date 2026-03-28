import cm from '@classmatejs/react'

interface PresenterProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean
  children?: React.ReactNode
}

export const Presenter = ({ elevated = false, children, ...props }: PresenterProps) => {
  return (
    <StyledPresenter $elevated={elevated} {...props}>
      {children}
    </StyledPresenter>
  )
}

const StyledPresenter = cm.div.variants<{ $elevated?: boolean }>({
  base: `
    p-4 py-0 mb-6
    rounded-box border 
  `,
  variants: {
    $elevated: {
      true: `
        shadow
        shadow-base-muted-superlight
        dark:shadow-black
        border-base-muted-light
      `,
      false: `
        inset-shadow-sm
        inset-shadow-base-muted-light
        dark:inset-shadow-black 
        border-base-muted-light
      `,
    },
  },
})
