// attention: no HMR is active for this file, changes require a full engine pre-build -> dev / preview
import { visit } from 'unist-util-visit'
import { createHeadingSlugger, normalizeHeadingTitle } from '../../docs/docHeadings.js'
import type { ElementContentNode, ElementNode, HtmlRootNode } from '../ast.js'

const headingTags = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])

const getNodeText = (node: ElementContentNode | HtmlRootNode): string => {
  if (node.type === 'text') {
    return typeof node.value === 'string' ? node.value : ''
  }

  if ('children' in node) {
    return node.children.map((child) => getNodeText(child)).join('')
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

const createLinkIconLine = (x1: number, y1: number, x2: number, y2: number): ElementNode => {
  return {
    type: 'element',
    tagName: 'line',
    properties: { x1, y1, x2, y2 },
    children: [],
  }
}

export const rehypeDocsHeadings = () => {
  return (tree: HtmlRootNode) => {
    const slugify = createHeadingSlugger()

    visit(tree, 'element', (node: ElementNode) => {
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
      if (!classNames.includes('scroll-mt-32')) {
        node.properties.className = [
          ...classNames,
          'scroll-mt-32',
          'xl:scroll-mt-22',
          'flex gap-2 items-center',
          'group',
          'relative',
          'w-fit',
        ].join(' ')
      }

      // create link element with has and anchor icon
      const linkElement: ElementNode = {
        type: 'element',
        tagName: 'a',
        properties: {
          href: `#${node.properties.id}`,
          'data-copy-heading-link': '',
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
              'aria-hidden': 'true',
              className: ['size-4 hidden group-hover:block group-focus-within:block translate-x-5'],
            },
            children: [
              createLinkIconLine(4, 9, 20, 9),
              createLinkIconLine(4, 15, 20, 15),
              createLinkIconLine(10, 3, 8, 21),
              createLinkIconLine(16, 3, 14, 21),
            ],
          },
        ],
      }
      node.children.push(linkElement)
    })
  }
}
