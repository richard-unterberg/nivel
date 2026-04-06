import type { ShikiTransformer } from 'shiki'

const LINK_RE = /https:\/\/[^\s]*[^.,\s"'`]/g

export const shikiTransformerAutoLinks = (): ShikiTransformer => {
  return {
    name: 'solid-docpress-shiki-autolinks',
    span(span) {
      if (span.children.length !== 1) {
        return
      }

      let child = span.children[0]
      if (child.type !== 'text') {
        return
      }

      const matches = Array.from(child.value.matchAll(LINK_RE)).filter(([href]) => !href.includes('${'))
      if (matches.length === 0) {
        return
      }

      const links = matches
        .map((match) => ({ href: match[0], index: match.index ?? 0 }))
        .sort((left, right) => right.index - left.index)

      const nextChildren: typeof span.children = []

      for (const { href, index } of links) {
        const endIndex = index + href.length
        const trailingText = child.value.slice(endIndex)

        if (trailingText) {
          nextChildren.unshift({ type: 'text', value: trailingText })
        }

        nextChildren.unshift({
          type: 'element',
          tagName: 'a',
          properties: { href },
          children: [{ type: 'text', value: href }],
        })

        child = {
          type: 'text',
          value: child.value.slice(0, index),
        }
      }

      if (child.value) {
        nextChildren.unshift(child)
      }

      span.children = nextChildren
    },
  }
}
