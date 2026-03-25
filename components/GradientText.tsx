import React from 'react'

interface GradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
  startColor?: string
  endColor?: string
  rotation?: number
}

const GradientText = React.forwardRef<HTMLSpanElement, GradientTextProps>(
  ({ children, color, startColor, endColor, rotation = 10, style, ...props }, ref) => {
    const isCustomGradient = Boolean(startColor && endColor)
    const usedStartColor = isCustomGradient ? startColor : 'primary'
    const usedEndColor = isCustomGradient ? endColor : 'accent'

    const gradientStyle = {
      '--gradient-start': `var(--color-${usedStartColor})`,
      '--gradient-end': `var(--color-${usedEndColor})`,
      background: `linear-gradient(${rotation}deg, var(--gradient-start), var(--gradient-end))`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      ...style,
    } as React.CSSProperties

    return (
      <span ref={ref} style={gradientStyle} {...props}>
        {children}
      </span>
    )
  },
)

GradientText.displayName = 'GradientText'

export default GradientText
