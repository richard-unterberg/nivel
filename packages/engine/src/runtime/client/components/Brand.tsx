import { maMerge } from '@marmo/react'
import type { ResolvedDocsBrandConfig } from '../../../docs/types.js'

interface BrandProps {
  brand: ResolvedDocsBrandConfig
  noText?: boolean
}

export const Brand = ({ brand, noText = false }: BrandProps) => {
  const defaultLogo = brand.logoLight ?? brand.logoDark

  return (
    <a
      href={brand.href}
      className="flex items-center gap-3 text-base-content h-full no-underline"
      aria-label={noText ? `${brand.text} homepage` : undefined}
    >
      {defaultLogo && (
        <span className="relative block h-8 w-8 shrink-0">
          {brand.logoLight && (
            <img
              src={brand.logoLight}
              alt={brand.logoAlt}
              className={maMerge('h-8 w-8 object-contain', brand.logoDark ? 'block dark:hidden' : 'block')}
            />
          )}
          {brand.logoDark && (
            <img
              src={brand.logoDark}
              alt={brand.logoAlt}
              className={maMerge('h-8 w-8 object-contain', brand.logoLight ? 'hidden dark:block' : 'block')}
            />
          )}
        </span>
      )}
      {!noText && <span className="text-xl font-semibold tracking-tight">{brand.text}</span>}
    </a>
  )
}
