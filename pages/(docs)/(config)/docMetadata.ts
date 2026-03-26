import type { PageContext } from 'vike/types'
import { getMdexSystemConfig } from '@/lib/docs/systemConfig'
import { getDocHeadingMetadata } from '@/lib/headings'
import pageConfig from '@/pages/+config'

type DocsPageContext = PageContext & {
  locale?: string
  routeParams?: {
    slug?: string
  }
}

const normalizeSlug = (value: string) => value.replace(/^\/+|\/+$/g, '')

const getFallbackMetadata = () => {
  return {
    title: typeof pageConfig.title === 'string' ? pageConfig.title : null,
    description: typeof pageConfig.description === 'string' ? pageConfig.description : null,
  }
}

export const getDocsHeadMetadata = (pageContext: PageContext) => {
  const docsPageContext = pageContext as DocsPageContext
  const docsConfig = getMdexSystemConfig(docsPageContext)
  const requestedSlug = normalizeSlug(docsPageContext.routeParams?.slug ?? '')
  const docSlug = requestedSlug || docsConfig.defaultSlug

  return getDocHeadingMetadata(docSlug, docsPageContext.locale) ?? getFallbackMetadata()
}
