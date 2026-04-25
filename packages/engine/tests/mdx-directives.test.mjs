import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { remarkRestoreUnsupportedDirectives } from '../dist/mdx/code-blocks.js'

const testsDir = path.dirname(fileURLToPath(import.meta.url))
const pnpmStoreDir = path.resolve(testsDir, '../../../node_modules/.pnpm')

const resolvePnpmPackageDir = (packagePrefix) => {
  const entry = fs.readdirSync(pnpmStoreDir).find((name) => name.startsWith(`${packagePrefix}@`))

  if (!entry) {
    throw new Error(`Unable to resolve pnpm package ${packagePrefix} from ${pnpmStoreDir}`)
  }

  return path.join(pnpmStoreDir, entry, 'node_modules', packagePrefix)
}

const fromMarkdownDir = resolvePnpmPackageDir('mdast-util-from-markdown')
const mdastDirectiveDir = resolvePnpmPackageDir('mdast-util-directive')
const micromarkDirectiveDir = resolvePnpmPackageDir('micromark-extension-directive')

const { fromMarkdown } = await import(pathToFileURL(path.join(fromMarkdownDir, 'index.js')).href)
const { directiveFromMarkdown } = await import(pathToFileURL(path.join(mdastDirectiveDir, 'index.js')).href)
const { directive } = await import(pathToFileURL(path.join(micromarkDirectiveDir, 'index.js')).href)

const parseWithDirectives = (source) => {
  return fromMarkdown(source, {
    extensions: [directive()],
    mdastExtensions: [directiveFromMarkdown()],
  })
}

const getNodeText = (node) => {
  if (!node || typeof node !== 'object') {
    return ''
  }

  if (node.type === 'text') {
    return typeof node.value === 'string' ? node.value : ''
  }

  if (!Array.isArray(node.children)) {
    return ''
  }

  return node.children.map((child) => getNodeText(child)).join('')
}

test('remarkRestoreUnsupportedDirectives preserves colon-separated times as literal text', () => {
  const source = `time tracking

### 25.04
#### Hey 22:00 - 23:00

22:00 - 23:00
`

  const tree = parseWithDirectives(source)
  const transform = remarkRestoreUnsupportedDirectives()

  transform(tree, { value: source })

  assert.equal(getNodeText(tree.children[2]), 'Hey 22:00 - 23:00')
  assert.equal(getNodeText(tree.children[3]), '22:00 - 23:00')
})

test('remarkRestoreUnsupportedDirectives keeps container directives intact for Choice blocks', () => {
  const source = `:::Choice{id=React}
\`\`\`ts
const message = 'hello'
\`\`\`
:::`

  const tree = parseWithDirectives(source)
  const transform = remarkRestoreUnsupportedDirectives()

  transform(tree, { value: source })

  assert.equal(tree.children[0]?.type, 'containerDirective')
  assert.equal(tree.children[0]?.name, 'Choice')
})
