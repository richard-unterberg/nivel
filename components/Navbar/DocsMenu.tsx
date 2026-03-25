import cm from '@classmatejs/react'
import { BookText, Cpu } from 'lucide-react'
import { usePageContext } from 'vike-react/usePageContext'
import { getHeadingData } from '@/lib/headings'

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
  const { locale, config } = usePageContext()

  return (
    <ul className="flex items-center font-semibold gap-2">
      <li>
        <MenuItem $active tabIndex={0} href={getHeadingData('docsHome', locale, config.mdex).href}>
          <BookText className="w-4 h-4" />
          {getHeadingData('docsHome', locale, config.mdex).title}
        </MenuItem>
      </li>
      <li>
        <MenuItem tabIndex={0} href={getHeadingData('components', locale, config.mdex).href}>
          <Cpu className="w-4 h-4" />
          {getHeadingData('components', locale, config.mdex).title}
        </MenuItem>
      </li>
      <li>
        <MenuItem tabIndex={0} href={getHeadingData('guides', locale, config.mdex).href}>
          <Cpu className="w-4 h-4" />
          {getHeadingData('guides', locale, config.mdex).title}
        </MenuItem>
      </li>
    </ul>
  )
}

export default DocsMenu
