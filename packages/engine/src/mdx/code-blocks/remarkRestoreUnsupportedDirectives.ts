import { visit } from 'unist-util-visit'
import type { FileLike, ParagraphNode, ParentNode, RootNode, TextNode, UnsupportedDirectiveNode } from '../ast.js'

type Replacement = {
  index: number
  node: UnsupportedDirectiveNode
  parent: ParentNode
}

export const remarkRestoreUnsupportedDirectives = () => {
  return (tree: RootNode, file: FileLike) => {
    const replacements: Replacement[] = []

    visit(tree, (node, index, parent) => {
      if ((node.type !== 'textDirective' && node.type !== 'leafDirective') || !parent || typeof index !== 'number') {
        return
      }

      replacements.push({
        index,
        node: node as UnsupportedDirectiveNode,
        parent,
      })
    })

    for (const replacement of [...replacements].reverse()) {
      const source = getDirectiveSource(replacement.node, file)
      if (!source) {
        continue
      }

      if (replacement.node.type === 'textDirective') {
        replacement.parent.children.splice(replacement.index, 1, createTextNode(source))
        continue
      }

      const paragraphNode: ParagraphNode = {
        type: 'paragraph',
        children: [createTextNode(source)],
      }

      replacement.parent.children.splice(replacement.index, 1, paragraphNode)
    }
  }
}

const createTextNode = (value: string): TextNode => {
  return {
    type: 'text',
    value,
  }
}

const getDirectiveSource = (node: UnsupportedDirectiveNode, file: FileLike) => {
  if (typeof file.value !== 'string') {
    return null
  }

  const start = node.position?.start?.offset
  const end = node.position?.end?.offset

  if (typeof start !== 'number' || typeof end !== 'number' || start >= end) {
    return null
  }

  return file.value.slice(start, end)
}
