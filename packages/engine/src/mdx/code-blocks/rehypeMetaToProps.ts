import { visit } from 'unist-util-visit'
import { getCodeBlockPropsFromMeta } from './meta.js'

export const rehypeMetaToProps = () => {
  return (tree: unknown) => {
    visit(tree as any, 'element', (node: any, _index, parent: any) => {
      if (node.tagName !== 'code' || parent?.type !== 'element' || parent.tagName !== 'pre') {
        return
      }

      const meta = getCodeBlockPropsFromMeta(node.data?.meta)
      parent.properties ??= {}
      parent.properties = {
        ...parent.properties,
        ...meta.props,
        ...(meta.title ? { 'data-code-title': meta.title } : {}),
      }
    })
  }
}
