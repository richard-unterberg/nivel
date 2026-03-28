import { extractTextFromHast } from './headings'
import { highlightCodeToHast } from './shiki'

type HastNode = {
  children?: HastNode[]
  properties?: Record<string, unknown>
  tagName?: string
  type?: string
}

const isElement = (node: HastNode | undefined, tagName?: string): node is HastNode => {
  return node?.type === 'element' && (tagName ? node.tagName === tagName : true)
}

const getClassNames = (properties?: Record<string, unknown>) => {
  const className = properties?.className ?? properties?.class

  if (Array.isArray(className)) {
    return className.flatMap((value) => String(value).split(/\s+/)).filter(Boolean)
  }

  if (typeof className === 'string') {
    return className.split(/\s+/).filter(Boolean)
  }

  return []
}

const appendClassName = (properties: Record<string, unknown>, className: string) => {
  const classes = new Set(getClassNames(properties))
  classes.add(className)
  properties.className = [...classes]
}

const getCodeLanguage = (node: HastNode) => {
  const languageClassName = getClassNames(node.properties).find((value) => value.startsWith('language-'))
  return languageClassName?.slice('language-'.length).trim().toLowerCase() ?? null
}

const highlightCodeBlock = async (node: HastNode) => {
  const codeNode = node.children?.find((child) => isElement(child, 'code'))
  if (!codeNode) return null

  const language = getCodeLanguage(codeNode)
  if (!language) return null

  const highlighted = await highlightCodeToHast(extractTextFromHast(codeNode.children ?? []), language)
  if (!highlighted) return null

  const highlightedPreCandidate = highlighted.children.find(
    (child) => child.type === 'element' && child.tagName === 'pre',
  )
  if (!highlightedPreCandidate || !isElement(highlightedPreCandidate, 'pre')) return null

  const highlightedPre = highlightedPreCandidate as HastNode

  highlightedPre.properties ??= {}
  appendClassName(highlightedPre.properties, 'doc-code-pre')
  highlightedPre.properties['data-language'] = language
  highlightedPre.properties['data-language-label'] = language

  return highlightedPre
}

const visit = async (node: HastNode) => {
  if (!node.children?.length) {
    return
  }

  for (let index = 0; index < node.children.length; index += 1) {
    const child = node.children[index]

    if (isElement(child, 'pre')) {
      const highlightedPre = await highlightCodeBlock(child)

      if (highlightedPre) {
        node.children[index] = highlightedPre
        continue
      }
    }

    await visit(child)
  }
}

export const rehypeShikiCodeBlocks = () => {
  return async (tree: HastNode) => {
    await visit(tree)
  }
}
