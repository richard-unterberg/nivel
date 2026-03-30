export { rehypeMetaToProps }

import { visit } from 'unist-util-visit'
import { parseMetaString } from './meta'

function rehypeMetaToProps() {
  return (tree: unknown) => {
    visit(tree as any, 'element', (node: any, _index, parent: any) => {
      if (node.tagName !== 'code' || parent?.type !== 'element' || parent.tagName !== 'pre') {
        return
      }

      const meta = parseMetaString(node.data?.meta)
      parent.properties ??= {}
      parent.properties = { ...parent.properties, ...meta.props }
    })
  }
}
