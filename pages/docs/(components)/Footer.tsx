import { Bug, Pencil, Smile } from 'lucide-react'
import { usePageContext } from 'vike-react/usePageContext'
import LanguageSwitch from '@/components/Navbar/LanguageSwitch'
import SocialIcons from '@/components/SocialIcons'
import { t } from '@/lib/i18n/messages'

const DocsFooter = () => {
  const { locale } = usePageContext()

  return (
    <footer className="mb-8 mt-12 text-sm text-base-content/60 border-t border-vike-grey pt-10">
      <div className="mb-16 flex items-center gap-2">
        <a href="edit" className="btn btn-sm btn-accent btn-outline ">
          <Pencil className="w-3 h-3" /> {t(locale, 'docs', 'edit')}
        </a>
        <a href="edit" className="btn btn-sm btn-accent btn-outline ">
          <Bug className="w-3 h-3" /> {t(locale, 'docs', 'reportIssue')}
        </a>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <p>
            <a href="vike.dev" className='text-neutral'>
              <Smile className="w-8 h-8" />
            </a>
          </p>
          <SocialIcons />
        </div>
        <LanguageSwitch />
      </div>
    </footer>
  )
}

export default DocsFooter
