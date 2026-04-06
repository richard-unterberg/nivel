import type { DocHeading } from './types.js'

const normalizeWhitespace = (value: string) => value.replace(/\s+/g, ' ').trim()

const slugifyHeading = (value: string) => {
  const normalized = normalizeWhitespace(value)
    .normalize('NFKD')
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, ' ')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')

  return normalized || 'section'
}

export const createHeadingSlugger = () => {
  const slugCounts = new Map<string, number>()

  return (value: string) => {
    const baseSlug = slugifyHeading(value)
    const count = slugCounts.get(baseSlug) ?? 0
    slugCounts.set(baseSlug, count + 1)

    return count === 0 ? baseSlug : `${baseSlug}-${count}`
  }
}

const stripInlineMarkdown = (value: string) => {
  return normalizeWhitespace(
    value
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\\([\\`*_[\]{}()#+\-.!])/g, '$1')
      .replace(/[*_~]/g, '')
      .replace(/\{[^}]+\}/g, ' '),
  )
}

const getFenceMarker = (line: string) => {
  const match = line.match(/^\s{0,3}(`{3,}|~{3,})/)
  return match?.[1]?.[0] ?? null
}

export const extractDocHeadings = (source: string, minDepth = 2, maxDepth = 3): DocHeading[] => {
  const slugify = createHeadingSlugger()
  const headings: DocHeading[] = []
  let activeFenceMarker: string | null = null

  for (const line of source.split('\n')) {
    const fenceMarker = getFenceMarker(line)

    if (activeFenceMarker) {
      if (fenceMarker === activeFenceMarker) {
        activeFenceMarker = null
      }
      continue
    }

    if (fenceMarker) {
      activeFenceMarker = fenceMarker
      continue
    }

    const match = line.match(/^\s{0,3}(#{1,6})\s+(.*?)(?:\s+#+\s*)?$/)
    if (!match) {
      continue
    }

    const depth = match[1].length
    const title = stripInlineMarkdown(match[2] ?? '')
    if (!title || depth < minDepth || depth > maxDepth) {
      continue
    }

    headings.push({
      depth,
      id: slugify(title),
      title,
    })
  }

  return headings
}

export const normalizeHeadingTitle = (value: string) => normalizeWhitespace(value)
