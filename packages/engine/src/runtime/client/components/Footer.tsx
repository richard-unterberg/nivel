import { Bug, Pencil } from 'lucide-react'
import { memo } from 'react'
import { useDocsGlobalContext } from '../docsGlobalContext.js'
import { Brand } from './Brand.js'
import SocialIcons from './SocialLinks.js'

export const DocsFooter = memo(() => {
  const { brand } = useDocsGlobalContext()

  return (
    <footer className="mb-8 mt-12 text-sm border-t border-base-muted-light pt-10">
      <div className="mb-16 flex items-center gap-2">
        <a href="edit" className="btn btn-sm btn-primary btn-soft">
          <Pencil className="w-3 h-3" /> Edit this page
        </a>
        <a href="edit" className="btn btn-sm btn-primary btn-soft">
          <Bug className="w-3 h-3" /> Report Issue
        </a>
      </div>
      <div className="flex justify-between items-center">
        <SocialIcons />
        <div className="flex gap-2 items-center">{brand && <Brand brand={brand} noText />}</div>
      </div>
    </footer>
  )
})
