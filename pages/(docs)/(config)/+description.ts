import type { PageContext } from 'vike/types'
import { getDocsHeadMetadata } from './docMetadata'

export default function description(pageContext: PageContext) {
  return getDocsHeadMetadata(pageContext).description
}
