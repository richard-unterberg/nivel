import { Bug, Pencil } from 'lucide-react'
import { usePageContext } from 'vike-react/usePageContext'
import BrandLogo from '@/components/BrandLogo'
import LanguageSwitch from '@/components/Navbar/LanguageSwitch'
import SocialIcons from '@/components/SocialIcons'
import { t } from '@/lib/messages'

const DocsFooter = () => {
  const { locale } = usePageContext()

  return (
    <footer className="mb-8 mt-12 text-sm border-t border-base-muted-light pt-10">
      <div className="mb-16 flex items-center gap-2">
        <a href="edit" className="btn btn-sm btn-primary btn-soft">
          <Pencil className="w-3 h-3" /> {t(locale, 'docs', 'edit')}
        </a>
        <a href="edit" className="btn btn-sm btn-primary btn-soft">
          <Bug className="w-3 h-3" /> {t(locale, 'docs', 'reportIssue')}
        </a>
      </div>
      <div className="flex justify-between items-center">
        <SocialIcons />
        <div className="flex gap-2 items-center">
          <LanguageSwitch />
          <p>
            <a href="unterberg.dev" className="text-base-content">
              <BrandLogo locale={locale} showText={false} />
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default DocsFooter
