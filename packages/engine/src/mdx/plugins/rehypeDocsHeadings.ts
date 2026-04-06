import { visit } from 'unist-util-visit'
import { createHeadingSlugger, normalizeHeadingTitle } from '../../docs/docHeadings.js'

const headingTags = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])

const getNodeText = (node: any): string => {
  if (!node || typeof node !== 'object') {
    return ''
  }

  if (node.type === 'text') {
    return typeof node.value === 'string' ? node.value : ''
  }

  if (Array.isArray(node.children)) {
    return node.children.map((child: any) => getNodeText(child)).join('')
  }

  return ''
}

const getClassNames = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.flatMap((entry) => getClassNames(entry))
  }

  if (typeof value === 'string') {
    return value.split(/\s+/).filter(Boolean)
  }

  return []
}

export const rehypeDocsHeadings = () => {
  return (tree: any) => {
    const slugify = createHeadingSlugger()

    visit(tree as any, 'element', (node: any) => {
      if (!headingTags.has(node?.tagName)) {
        return
      }

      const title = normalizeHeadingTitle(getNodeText(node))
      if (!title) {
        return
      }

      node.properties ??= {}

      if (typeof node.properties.id !== 'string' || node.properties.id === '') {
        node.properties.id = slugify(title)
      }

      const classNames = getClassNames(node.properties.className)
      if (!classNames.includes('scroll-mt-24')) {
        node.properties.className = [...classNames, 'scroll-mt-24']
      }
    })
  }
}
