// attention: no HMR is active for this file, changes require a full engine pre-build -> dev / preview
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
        node.properties.className = [
          ...classNames,
          'scroll-mt-24',
          'flex gap-2 items-center',
          'group',
          'relative',
          'w-fit',
        ].join(' ')
      }

      // create link element with has and anchor icon
      const linkElement = {
        type: 'element',
        tagName: 'a',
        properties: {
          href: `#${node.properties.id}`,
          'data-copy-heading-link': '',
          'aria-hidden': 'true',
          'aria-label': `Copy link to heading: ${title}`,
          title: `Copy link to heading: ${title}`,
          className: ['docs-heading-link absolute inset-0 flex items-center justify-end text-primary-muted'],
        },
        children: [
          {
            type: 'element',
            tagName: 'svg',
            properties: {
              xmlns: 'http://www.w3.org/2000/svg',
              width: 16,
              height: 16,
              viewBox: '0 0 24 24',
              fill: 'none',
              stroke: 'currentColor',
              'stroke-width': 2,
              'stroke-linecap': 'round',
              'stroke-linejoin': 'round',
              className: ['w-4 h-4 hidden group-hover:block translate-x-5'],
            },
            children: [
              {
                type: 'element',
                tagName: 'line',
                properties: { x1: 4, y1: 9, x2: 20, y2: 9 },
                children: [],
              },
              {
                type: 'element',
                tagName: 'line',
                properties: { x1: 4, y1: 15, x2: 20, y2: 15 },
                children: [],
              },
              {
                type: 'element',
                tagName: 'line',
                properties: { x1: 10, y1: 3, x2: 8, y2: 21 },
                children: [],
              },
              {
                type: 'element',
                tagName: 'line',
                properties: { x1: 16, y1: 3, x2: 14, y2: 21 },
                children: [],
              },
            ],
          },
        ],
      }
      node.children.push(linkElement)
    })
  }
}
