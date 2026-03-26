import type { PageContext } from 'vike/types'
import { getDocsHeadMetadata } from './docMetadata'

export default function title(pageContext: PageContext) {
  return `${getDocsHeadMetadata(pageContext)?.title ?? ''} | mdex`
}
