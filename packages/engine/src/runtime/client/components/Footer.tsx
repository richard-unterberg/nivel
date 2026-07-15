import { Bug, Pencil } from 'lucide-react'
import { memo } from 'react'
import type { ResolvedDocsPage } from '../../../docs/types.js'
import { useDocsGlobalContext } from '../docsGlobalContext.js'
import { Brand } from './Brand.js'
import SocialIcons from './SocialLinks.js'

type DocsFooterProps = {
  page: Pick<ResolvedDocsPage, 'source'>
}

const trimSlashes = (value: string) => value.replace(/^\/+|\/+$/g, '')

const encodePath = (value: string) => {
  return trimSlashes(value)
    .split('/')
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join('/')
}

const getGithubHref = (github: string | undefined) => {
  return github ? github.replace(/\/+$/g, '') : null
}

export const getEditPageHref = (options: {
  github: string | undefined
  branch: string | undefined
  pathPrefix: string | undefined
  contentDir: string
  source: string
}) => {
  const githubHref = getGithubHref(options.github)
  const branch = options.branch ? encodePath(options.branch) : ''

  if (!githubHref || !branch) {
    return null
  }

  const sourcePath = [options.pathPrefix, options.contentDir, options.source].filter(Boolean).join('/')

  return `${githubHref}/edit/${branch}/${encodePath(sourcePath)}`
}

export const DocsFooter = memo(({ page }: DocsFooterProps) => {
  const { brand, contentDir, social } = useDocsGlobalContext()
  const githubHref = getGithubHref(social?.github)
  const editPageHref = getEditPageHref({
    github: social?.github,
    branch: social?.editLinkBranch,
    pathPrefix: social?.editLinkPathPrefix,
    contentDir,
    source: page.source,
  })

  return (
    <footer className="mb-8 mt-12 text-sm border-t border-base-muted-light pt-10">
      {githubHref && (
        <div className="mb-16 flex items-center gap-2">
          {editPageHref && (
            <a
              href={editPageHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-primary btn-soft"
            >
              <Pencil className="size-3" /> Edit this page
            </a>
          )}
          <a
            href={`${githubHref}/issues/new`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-primary btn-soft"
          >
            <Bug className="size-3" /> Report Issue
          </a>
        </div>
      )}
      <div className="flex justify-between items-center">
        <SocialIcons />
        <div className="flex gap-2 items-center">{brand && <Brand brand={brand} noText />}</div>
      </div>
    </footer>
  )
})
