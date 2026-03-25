import cm from '@classmatejs/react'

const LayoutSize = {
  xxs: 'xxs',
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
  full: 'full',
} as const
type LayoutSize = (typeof LayoutSize)[keyof typeof LayoutSize]

const layoutComponentSizeMapping: { [key in LayoutSize]: string } = {
  xxs: 'max-w-[480px]',
  xs: 'max-w-[768px]',
  sm: 'max-w-[960px]',
  md: 'max-w-[1100px]', // 1140 base header width - 2 x 20px padding from header elements..
  lg: 'max-w-7xl',
  xl: 'max-w-[1440px]',
  full: 'max-w-full',
} as const

interface LayoutComponentProps {
  $size?: LayoutSize
  $noGrow?: boolean
}

const LayoutComponent = cm.div.variants<LayoutComponentProps>({
  base: ({ $noGrow }) => `px-4 ${$noGrow ? '' : 'm-auto w-full'} relative`,
  variants: {
    $size: layoutComponentSizeMapping,
  },
  defaultVariants: {
    $size: LayoutSize.xl,
  },
})

export default LayoutComponent
