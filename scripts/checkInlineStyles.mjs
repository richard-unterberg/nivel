import { execFileSync } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const inlineStyleWhitelist = [
  // pattern background in navbar
  'packages/telefunc/components/app/Navbar/index.tsx',
  // @todo: remove soon
  'packages/telefunc/pages/(docs)/(content)/file-uploads/content.en.mdx',
]

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')

const supportedExtensions = new Set([
  '.cjs',
  '.cts',
  '.html',
  '.js',
  '.jsx',
  '.md',
  '.mdx',
  '.mjs',
  '.mts',
  '.svg',
  '.ts',
  '.tsx',
  '.xml',
])

const ignoredPathSegments = ['/dist/', '/node_modules/', '/pages/(docs)/(generated)/']

const args = process.argv.slice(2)
const stagedOnly = args.includes('--staged')
const explicitPaths = args.filter((arg) => arg !== '--staged')

const files = getCandidateFiles({ stagedOnly, explicitPaths })
const violations = []

for (const filePath of files) {
  const absolutePath = path.join(repoRoot, filePath)
  const source = await fs.readFile(absolutePath, 'utf8')
  const fileViolations = findInlineStyleViolations(filePath, source)
  violations.push(...fileViolations)
}

if (violations.length > 0) {
  console.error('Inline style attributes are not allowed in this repo.')
  console.error(
    'Use Components + DaisyUI classes instead, or add a whitelist entry if an exception is truly unavoidable.\n',
  )

  for (const violation of violations) {
    console.error(`${violation.file}:${violation.line}:${violation.column} ${violation.snippet}`)
  }

  process.exit(1)
}

console.log(`Inline style check passed for ${files.length} file${files.length === 1 ? '' : 's'}.`)

function getCandidateFiles({ stagedOnly, explicitPaths }) {
  const filePaths = explicitPaths.length > 0 ? explicitPaths : getGitFiles(stagedOnly)
  return [...new Set(filePaths.map(normalizePath))]
    .filter((filePath) => filePath.length > 0)
    .filter((filePath) => !isIgnoredPath(filePath))
    .filter((filePath) => supportedExtensions.has(path.posix.extname(filePath)))
    .filter((filePath) => !isWhitelisted(filePath))
}

function getGitFiles(stagedOnly) {
  const gitArgs = stagedOnly ? ['diff', '--cached', '--name-only', '--diff-filter=ACMR'] : ['ls-files']

  const output = execFileSync('git', gitArgs, {
    cwd: repoRoot,
    encoding: 'utf8',
  })

  return output
    .split('\n')
    .map((filePath) => filePath.trim())
    .filter(Boolean)
}

function normalizePath(filePath) {
  return filePath.split(path.sep).join(path.posix.sep)
}

function isIgnoredPath(filePath) {
  return ignoredPathSegments.some((segment) => filePath.includes(segment))
}

function isWhitelisted(filePath) {
  return inlineStyleWhitelist.some((entry) => {
    const normalizedEntry = normalizePath(entry)
    return filePath === normalizedEntry || filePath.endsWith(`/${normalizedEntry}`)
  })
}

function findInlineStyleViolations(filePath, source) {
  const extension = path.posix.extname(filePath)

  if (isCodeFile(extension)) {
    return findJsxStyleViolations(filePath, source, extension)
  }

  if (extension === '.md' || extension === '.mdx') {
    return findRegexViolations(filePath, stripMarkdownCodeFences(source))
  }

  return findRegexViolations(filePath, source)
}

function isCodeFile(extension) {
  return ['.cjs', '.cts', '.js', '.jsx', '.mjs', '.mts', '.ts', '.tsx'].includes(extension)
}

function findJsxStyleViolations(filePath, source, extension) {
  const sourceFile = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true, getScriptKind(extension))

  const results = []

  function visit(node) {
    if (ts.isJsxAttribute(node) && node.name.text === 'style') {
      const position = sourceFile.getLineAndCharacterOfPosition(node.name.getStart(sourceFile))
      results.push({
        file: filePath,
        line: position.line + 1,
        column: position.character + 1,
        snippet: source.slice(node.getStart(sourceFile), node.getEnd()).split('\n')[0].trim(),
      })
    }

    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  return results
}

function getScriptKind(extension) {
  switch (extension) {
    case '.jsx':
      return ts.ScriptKind.JSX
    case '.tsx':
      return ts.ScriptKind.TSX
    case '.js':
    case '.mjs':
    case '.cjs':
      return ts.ScriptKind.JS
    default:
      return ts.ScriptKind.TS
  }
}

function stripMarkdownCodeFences(source) {
  const lines = source.split('\n')
  let activeFence = null

  return lines
    .map((line) => {
      const trimmed = line.trimStart()
      const fenceMatch = trimmed.match(/^(```+|~~~+)/)

      if (!fenceMatch) {
        return activeFence ? '' : line
      }

      const marker = fenceMatch[1][0]

      if (activeFence === null) {
        activeFence = marker
        return ''
      }

      if (activeFence === marker) {
        activeFence = null
      }

      return ''
    })
    .join('\n')
}

function findRegexViolations(filePath, source) {
  const results = []
  const lines = source.split('\n')

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    const match = /\bstyle\s*=/.exec(line)

    if (!match) {
      continue
    }

    results.push({
      file: filePath,
      line: index + 1,
      column: match.index + 1,
      snippet: line.trim(),
    })
  }

  return results
}
