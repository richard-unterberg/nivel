import cm from '@classmatejs/react'
import { BookText, Code, Cpu, Megaphone } from 'lucide-react'
import { usePageContext } from 'vike-react/usePageContext'
import { t } from '@/lib/i18n/messages'
import { localizeHref } from '@/lib/i18n/routing'

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

const DocsMenu = () => {
  const { locale } = usePageContext()
  const docsHomeHref = localizeHref('/docs', locale)

  return (
    <ul className="flex items-center font-semibold gap-2">
      <li>
        <MenuItem $active tabIndex={0} href={docsHomeHref}>
          <BookText className="w-4 h-4" />
          {t(locale, 'header', 'docsHome')}
        </MenuItem>
      </li>
      <li>
        <MenuItem tabIndex={0}>
          <Cpu className="w-4 h-4" />
          {t(locale, 'header', 'apiHome')}
        </MenuItem>
      </li>
      <li>
        <MenuItem tabIndex={0}>
          <Code className="w-4 h-4" />
          {t(locale, 'header', 'docsForDevs')}
        </MenuItem>
      </li>
      <li>
        <MenuItem tabIndex={0}>
          <Megaphone className="w-4 h-4" />
          {t(locale, 'header', 'blogHome')}
        </MenuItem>
      </li>
    </ul>
  )
}

export default DocsMenu
