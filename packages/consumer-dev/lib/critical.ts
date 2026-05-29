import fs from 'node:fs/promises'
import path from 'node:path'
import Beasties from 'beasties'
import type { Plugin, ResolvedConfig } from 'vite'

const HTML_FILE_EXTENSION = '.html'
const CRITICAL_BODY_CHARACTER_LIMIT = 6_000
const GLOBAL_STYLESHEET_PATH_FRAGMENT = '/assets/static/styles_global-'

type StylesheetLink = {
  href: string
  tag: string
}

const isNodeError = (error: unknown): error is Error & { code?: string } => {
  return error instanceof Error && 'code' in error
}

const readDirectoryIfExists = async (directoryPath: string) => {
  try {
    return await fs.readdir(directoryPath, { withFileTypes: true })
  } catch (error) {
    if (isNodeError(error) && error.code === 'ENOENT') {
      return []
    }

    throw error
  }
}

const collectHtmlFiles = async (directoryPath: string): Promise<string[]> => {
  const entries = await readDirectoryIfExists(directoryPath)
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directoryPath, entry.name)

      if (entry.isDirectory()) {
        return collectHtmlFiles(entryPath)
      }

      return entry.isFile() && path.extname(entry.name) === HTML_FILE_EXTENSION ? [entryPath] : []
    }),
  )

  return files.flat()
}

const getAttribute = (tag: string, attributeName: string) => {
  const match = tag.match(new RegExp(`\\s${attributeName}=["']([^"']+)["']`, 'i'))
  return match?.[1]
}

const findGlobalStylesheetLink = (html: string): StylesheetLink | undefined => {
  for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
    const tag = match[0]
    const rel = getAttribute(tag, 'rel')
    const href = getAttribute(tag, 'href')

    if (rel?.split(/\s+/).includes('stylesheet') && href?.includes(GLOBAL_STYLESHEET_PATH_FRAGMENT)) {
      return { href, tag }
    }
  }
}

const truncateHtmlFragment = (html: string, characterLimit: number) => {
  if (html.length <= characterLimit) {
    return html
  }

  const endIndex = html.lastIndexOf('>', characterLimit)
  return html.slice(0, endIndex === -1 ? characterLimit : endIndex + 1)
}

const createCriticalHtml = (html: string) => {
  const bodyOpenMatch = html.match(/<body\b[^>]*>/i)

  if (bodyOpenMatch?.index === undefined) {
    return html
  }

  const bodyContentStartIndex = bodyOpenMatch.index + bodyOpenMatch[0].length
  const bodyContentEndIndex = html.search(/<\/body>/i)
  const htmlPrefix = html.slice(0, bodyContentStartIndex)
  const bodyContent = html.slice(bodyContentStartIndex, bodyContentEndIndex === -1 ? undefined : bodyContentEndIndex)
  const criticalBodyContent = truncateHtmlFragment(bodyContent, CRITICAL_BODY_CHARACTER_LIMIT)

  return `${htmlPrefix}${criticalBodyContent}</body></html>`
}

const extractCriticalStyle = (html: string, stylesheetHref: string) => {
  const stylesheetLinkMatch = [...html.matchAll(/<link\b[^>]*>/gi)].find((match) => {
    return getAttribute(match[0], 'href') === stylesheetHref
  })

  if (stylesheetLinkMatch?.index === undefined) {
    return
  }

  const styleStartIndex = html.lastIndexOf('<style', stylesheetLinkMatch.index)
  const styleEndIndex = html.indexOf('</style>', styleStartIndex)

  if (styleStartIndex === -1 || styleEndIndex === -1) {
    return
  }

  return html.slice(styleStartIndex, styleEndIndex + '</style>'.length)
}

const createDeferredStylesheetMarkup = (stylesheetLink: StylesheetLink) => {
  const type = getAttribute(stylesheetLink.tag, 'type')
  const typeAttribute = type ? ` type="${type}"` : ''

  return `<link rel="preload"${typeAttribute} href="${stylesheetLink.href}" onload="this.rel='stylesheet'" as="style"><noscript>${stylesheetLink.tag}</noscript>`
}

export const viteBeastiesOutputPlugin = (): Plugin => {
  let resolvedConfig: ResolvedConfig | undefined

  return {
    name: 'consumer-dev-beasties-output',
    apply: 'build',
    enforce: 'post',
    configResolved: (config) => {
      resolvedConfig = config
    },
    async closeBundle() {
      if (this.environment.config.consumer !== 'server' || !resolvedConfig) {
        return
      }

      const serverOutputDirectory = path.resolve(resolvedConfig.root, this.environment.config.build.outDir)
      const outputDirectory = path.join(path.dirname(serverOutputDirectory), 'client')
      const htmlFiles = await collectHtmlFiles(outputDirectory)

      if (htmlFiles.length === 0) {
        return
      }

      const beasties = new Beasties({
        path: outputDirectory,
        publicPath: resolvedConfig.base,
        preload: 'swap',
        pruneSource: false,
        compress: true,
        logLevel: 'warn',
      })

      await Promise.all(
        htmlFiles.map(async (htmlFile) => {
          const html = await fs.readFile(htmlFile, 'utf8')
          const stylesheetLink = findGlobalStylesheetLink(html)

          if (!stylesheetLink) {
            return
          }

          const processedCriticalHtml = await beasties.process(createCriticalHtml(html))
          const criticalStyle = extractCriticalStyle(processedCriticalHtml, stylesheetLink.href)

          if (!criticalStyle) {
            return
          }

          const processedHtml = html.replace(
            stylesheetLink.tag,
            `${criticalStyle}${createDeferredStylesheetMarkup(stylesheetLink)}`,
          )

          if (processedHtml !== html) {
            await fs.writeFile(htmlFile, processedHtml)
          }
        }),
      )
    },
  }
}
