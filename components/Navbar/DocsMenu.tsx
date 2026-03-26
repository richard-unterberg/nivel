import cm from '@classmatejs/react'
import { BookText, Cpu, Map as MapIcon } from 'lucide-react'
import { usePageContext } from 'vike-react/usePageContext'
import { matchDocPath } from '@/lib/docs/systemConfig'
import { getHeadingData } from '@/lib/headings'
import { getLogicalPathname } from '@/lib/i18n/routing'

type DocsMenuSection = 'docsHome' | 'components' | 'guides'

const MenuItem = cm.a.variants<{ $active?: boolean }>({
  base: 'btn btn-sm btn-neutral px-2 uppercase whitespace-nowrap',
  variants: {
    $active: {
      true: '',
      false: 'btn-soft ',
    },
  },
  defaultVariants: {
    $active: false,
  },
})

const getActiveSection = (pathname: string, mdexConfig: Parameters<typeof matchDocPath>[1]): DocsMenuSection | null => {
  const docSlug = matchDocPath(getLogicalPathname(pathname), mdexConfig)

  if (docSlug === null) {
    return null
  }

  const [section = ''] = docSlug.split('/').filter(Boolean)

  if (section === 'components') {
    return 'components'
  }

  if (section === 'guides') {
    return 'guides'
  }

  return 'docsHome'
}

const DocsMenu = () => {
  const pageContext = usePageContext()
  const { locale, config, urlPathnameLocalized, urlPathname } = pageContext
  const activeSection = getActiveSection(urlPathnameLocalized ?? urlPathname, config.mdex)
  const items: Array<{ key: DocsMenuSection; href: string; title: string; icon: typeof BookText }> = [
    {
      key: 'docsHome',
      ...getHeadingData('docsHome', locale, config.mdex),
      icon: BookText,
    },
    {
      key: 'components',
      ...getHeadingData('components', locale, config.mdex),
      icon: Cpu,
    },
    {
      key: 'guides',
      ...getHeadingData('guides', locale, config.mdex),
      icon: MapIcon,
    },
  ]

  return (
    <ul className="flex items-center font-semibold gap-2">
      {items.map((item) => {
        const Icon = item.icon

        return (
          <li key={item.key}>
            <MenuItem $active={item.key === activeSection} tabIndex={0} href={item.href}>
              <Icon className="w-4 h-4" />
              {item.title}
            </MenuItem>
          </li>
        )
      })}
    </ul>
  )
}

export default DocsMenu
