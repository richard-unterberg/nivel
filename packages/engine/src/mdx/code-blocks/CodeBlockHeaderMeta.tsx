import ma from '@marmo/react'

export { CodeBlockHeaderMeta }

const CodeBlockHeaderMeta = ({ env, label }: { env?: string | null; label: string }) => {
  const effectiveEnv = env === 'server' || env === 'client' ? env : undefined

  return (
    <div className="flex min-w-0 items-center gap-2">
      {env && <StyledDivider $env={env === 'server' || env === 'client' ? env : undefined} />}
      {env && <StyledBgShade $env={env === 'server' || env === 'client' ? env : undefined} />}
      {env && <StyledBadge $env={effectiveEnv}>{env}</StyledBadge>}
      <div className="font-mono text-xs font-semibold text-base-muted">{label}</div>
    </div>
  )
}

const StyledDivider = ma.div.variants<{ $env?: 'server' | 'client' }>({
  base: 'absolute h-1 -bottom-px left-0 w-full pointer-events-none',
  variants: {
    $env: {
      server: 'border-info/50 border-b ',
      client: 'border-success/50 border-b',
    },
  },
  defaultVariants: { $env: 'server' },
})

const StyledBadge = ma.div.variants<{ $env?: 'server' | 'client' }>({
  base: 'shrink-0 badge badge-sm rounded-field badge-soft border pointer-events-none',
  variants: {
    $env: {
      server: 'badge-info border-info',
      client: 'badge-success border-success',
    },
  },
  defaultVariants: { $env: 'server' },
})

const StyledBgShade = ma.div.variants<{ $env?: 'server' | 'client' }>({
  base: 'absolute inset-0 opacity-5 bg-linear-to-t via-40% via-transparent pointer-events-none',
  variants: {
    $env: {
      server: 'from-info',
      client: 'from-success',
    },
  },
  defaultVariants: { $env: 'server' },
})
