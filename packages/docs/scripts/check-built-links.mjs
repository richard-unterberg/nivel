import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const outputDirectory = path.resolve(scriptDirectory, '..', 'dist', 'client')
const normalizedBase = process.env.PAGES_BASE_PATH?.trim().replace(/^\/+|\/+$/g, '') ?? ''
const siteBasePath = normalizedBase ? `/${normalizedBase}/` : '/'

const collectHtmlFiles = (directory) => {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name)
    return entry.isDirectory() ? collectHtmlFiles(entryPath) : entry.name.endsWith('.html') ? [entryPath] : []
  })
}

const getPagePathname = (filePath) => {
  const relativePath = path.relative(outputDirectory, filePath).replaceAll(path.sep, '/')

  if (relativePath === 'index.html') {
    return siteBasePath
  }

  if (relativePath.endsWith('/index.html')) {
    return `${siteBasePath}${relativePath.slice(0, -'index.html'.length)}`
  }

  return `${siteBasePath}${relativePath}`
}

const isExternalReference = (value) => {
  return value.startsWith('#') || value.startsWith('//') || /^[a-z][a-z\d+.-]*:/i.test(value)
}

const resolveOutputTarget = (pathname) => {
  const relativePath = pathname.slice(siteBasePath.length).replace(/^\/+/, '')
  const decodedPath = decodeURIComponent(relativePath)
  const directTarget = path.join(outputDirectory, decodedPath)

  if (fs.existsSync(directTarget) && fs.statSync(directTarget).isFile()) {
    return directTarget
  }

  const indexTarget = path.join(directTarget, 'index.html')
  return fs.existsSync(indexTarget) ? indexTarget : null
}

if (!fs.existsSync(outputDirectory)) {
  throw new Error(`Missing docs build output at ${outputDirectory}. Run the docs build before checking links.`)
}

const failures = []

for (const htmlFile of collectHtmlFiles(outputDirectory)) {
  const source = fs.readFileSync(htmlFile, 'utf8')
  const sourcePath = path.relative(outputDirectory, htmlFile).replaceAll(path.sep, '/')
  const pageUrl = new URL(getPagePathname(htmlFile), 'https://nivel-docs.de')

  for (const match of source.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const reference = match[1]

    if (!reference || isExternalReference(reference)) {
      continue
    }

    const targetUrl = new URL(reference, pageUrl)

    if (!targetUrl.pathname.startsWith(siteBasePath)) {
      failures.push(`${sourcePath}: ${reference} escapes the configured site base ${siteBasePath}`)
      continue
    }

    if (!resolveOutputTarget(targetUrl.pathname)) {
      failures.push(`${sourcePath}: ${reference} does not resolve to built output`)
    }
  }
}

if (failures.length > 0) {
  throw new Error(`Broken local references:\n${failures.map((failure) => `- ${failure}`).join('\n')}`)
}

console.log(`Checked local references in ${collectHtmlFiles(outputDirectory).length} HTML files for ${siteBasePath}.`)
