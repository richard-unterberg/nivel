import { fileURLToPath } from 'node:url'
import type { Plugin } from 'vite'
import { docsGeneratedIconImportPaths } from '../generated/iconImportPaths.js'

const nivelIconsImportSource = '@unterberg/nivel/icons'
const lucideReactImportSource = 'lucide-react'
const virtualNivelIconImportPrefix = 'virtual:nivel-icons/'
const nivelIconsImportPattern = /import\s+((?:type\s+)?[\s\S]*?)\s+from\s+(['"])@unterberg\/nivel\/icons\2\s*;?/g
const sourceFilePattern = /\.(?:[cm]?[jt]sx?|mdx)$/

type ImportSpecifier = {
  imported: string
  isType: boolean
  local: string
}

const parseNamedImportSpecifiers = (importClause: string) => {
  const namedImportsStartIndex = importClause.indexOf('{')
  const namedImportsEndIndex = importClause.lastIndexOf('}')

  if (namedImportsStartIndex === -1 || namedImportsEndIndex === -1) {
    return null
  }

  const importPrefix = importClause.slice(0, namedImportsStartIndex).trim()

  if (importPrefix && importPrefix !== 'type') {
    return null
  }

  const isTypeOnlyImport = importPrefix === 'type'
  const namedImportsSource = importClause.slice(namedImportsStartIndex + 1, namedImportsEndIndex)

  return namedImportsSource
    .split(',')
    .map((specifierSource): ImportSpecifier | null => {
      let normalizedSpecifierSource = specifierSource.trim()

      if (!normalizedSpecifierSource) {
        return null
      }

      const isType = isTypeOnlyImport || normalizedSpecifierSource.startsWith('type ')

      if (normalizedSpecifierSource.startsWith('type ')) {
        normalizedSpecifierSource = normalizedSpecifierSource.slice('type '.length).trim()
      }

      const [imported, local = imported] = normalizedSpecifierSource.split(/\s+as\s+/)

      return {
        imported,
        isType,
        local,
      }
    })
    .filter((specifier): specifier is ImportSpecifier => specifier !== null)
}

const renderTypeSpecifier = ({ imported, local }: ImportSpecifier) => {
  return imported === local ? imported : `${imported} as ${local}`
}

const resolveIconImportPath = (iconName: string) => {
  const iconImportPath = docsGeneratedIconImportPaths[iconName as keyof typeof docsGeneratedIconImportPaths]

  if (!iconImportPath) {
    return null
  }

  return fileURLToPath(import.meta.resolve(iconImportPath))
}

const rewriteNivelIconsImport = (fullImportSource: string, importClause: string) => {
  const specifiers = parseNamedImportSpecifiers(importClause)

  if (!specifiers) {
    return fullImportSource
  }

  const rewrittenImports: string[] = []
  const typeSpecifiers: ImportSpecifier[] = []

  for (const specifier of specifiers) {
    if (specifier.isType) {
      typeSpecifiers.push(specifier)
      continue
    }

    if (!resolveIconImportPath(specifier.imported)) {
      return fullImportSource
    }

    rewrittenImports.push(`import ${specifier.local} from '${virtualNivelIconImportPrefix}${specifier.imported}'`)
  }

  if (typeSpecifiers.length > 0) {
    rewrittenImports.unshift(
      `import type { ${typeSpecifiers.map(renderTypeSpecifier).join(', ')} } from '${lucideReactImportSource}'`,
    )
  }

  return rewrittenImports.join('\n')
}

export const nivelIconsImportRewritePlugin = () => {
  return {
    name: 'nivel-icons-import-rewrite',
    enforce: 'pre',
    resolveId: (source) => {
      if (!source.startsWith(virtualNivelIconImportPrefix)) {
        return null
      }

      return resolveIconImportPath(source.slice(virtualNivelIconImportPrefix.length))
    },
    transform: (code, id) => {
      const [filePath] = id.split('?')

      if (!filePath || !sourceFilePattern.test(filePath) || !code.includes(nivelIconsImportSource)) {
        return null
      }

      const rewrittenCode = code.replace(nivelIconsImportPattern, rewriteNivelIconsImport)

      if (rewrittenCode === code) {
        return null
      }

      return {
        code: rewrittenCode,
        map: null,
      }
    },
  } satisfies Plugin
}
