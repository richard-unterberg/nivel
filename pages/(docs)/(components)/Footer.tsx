import { Bug, Pencil } from 'lucide-react'
import { usePageContext } from 'vike-react/usePageContext'
import { t } from '@/lib/i18n/messages'

const DocsFooter = () => {
  const { locale } = usePageContext()

  return (
    <footer className="mb-8 mt-12 text-sm text-base-content/60">
      <div className="mb-16 flex items-center gap-2">
        <a href="edit" className="btn btn-sm btn-ghost border-vike-grey">
          <Pencil /> {t(locale, 'docs', 'edit')}
        </a>
        <a href="edit" className="btn btn-sm btn-ghost border-vike-grey">
          <Bug /> {t(locale, 'docs', 'reportIssue')}
        </a>
      </div>
      <a href="vike.dev" className="text-primary">
        Vike
      </a>
      &nbsp;|&nbsp;Copyright &copy; {new Date().getFullYear()}. All rights reserved.
    </footer>
  )
}

export default DocsFooter
