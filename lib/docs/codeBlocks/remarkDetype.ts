export { remarkDetype }

import { transform as detype } from 'detype'
import { visit } from 'unist-util-visit'
import { generateChoiceGroupCode } from './generateChoiceGroupCode'
import { parseMetaString } from './meta'

const prettierOptions = {
  semi: false,
  singleQuote: true,
  trailingComma: 'none',
} as const

function remarkDetype() {
  return async (tree: unknown, file: any) => {
    const codeNodes: Array<{ codeBlock: any; index: number; parent: any }> = []

    visit(tree as any, 'code', (node: any, index: number | undefined, parent: any) => {
      if (!parent || typeof index !== 'number') {
        return
      }

      if (!['ts', 'tsx', 'vue', 'yaml'].includes(node.lang ?? '')) {
        return
      }

      if (typeof node.meta === 'string' && node.meta.includes('ts-only')) {
        return
      }

      codeNodes.push({ codeBlock: node, index, parent })
    })

    for (const node of [...codeNodes].reverse()) {
      if (node.codeBlock.lang === 'yaml') {
        transformYaml(node)
      } else {
        await transformTsToJs(node, file)
      }
    }
  }
}

const transformYaml = (node: { codeBlock: any; index: number; parent: any }) => {
  const { codeBlock, index, parent } = node
  const codeBlockContentJs = replaceFileNameSuffixes(codeBlock.value)

  if (codeBlockContentJs === codeBlock.value) {
    return
  }

  const meta = parseMetaString(codeBlock.meta, ['choice'])
  const choice = meta.props.choice
  codeBlock.meta = meta.rest

  const yamlJsCode = {
    ...codeBlock,
    value: codeBlockContentJs,
  }

  const replacement = generateChoiceGroupCode([
    { choiceValue: 'JavaScript', children: [yamlJsCode] },
    { choiceValue: 'TypeScript', children: [codeBlock] },
  ])

  replacement.attributes.push({ type: 'mdxJsxAttribute', name: 'hide' })
  replacement.data ??= {} as any
  ;(replacement.data as any).customDataChoice = choice
  ;(replacement.data as any).customDataFilter = 'codeLang'
  parent.children.splice(index, 1, replacement)
}

const transformTsToJs = async (node: { codeBlock: any; index: number; parent: any }, file: any) => {
  const { codeBlock, index, parent } = node
  const meta = parseMetaString(codeBlock.meta, ['max-width', 'choice'])
  const maxWidth = Number(meta.props['max-width'])
  const choice = meta.props.choice
  codeBlock.meta = meta.rest

  codeBlock.data ??= {}
  codeBlock.data.customDataChoice = choice
  codeBlock.data.customDataFilter = 'codeLang'

  if (choice === 'TypeScript') {
    return
  }

  const codeBlockReplacedJs = replaceFileNameSuffixes(codeBlock.value)
  let codeBlockContentJs = ''

  try {
    codeBlockContentJs = await detype(codeBlockReplacedJs, `snippet.${codeBlock.lang}`, {
      customizeBabelConfig(config) {
        if (!config.presets || config.presets.length !== 1) {
          return
        }

        config.presets = [[config.presets[0], { onlyRemoveTypeImports: true }]]
      },
      removeTsComments: true,
      prettierOptions: {
        ...prettierOptions,
        printWidth: Number.isFinite(maxWidth) && maxWidth > 0 ? maxWidth : 99,
      },
    })
  } catch (error) {
    console.error(
      [
        `Failed to detype code block in ${file?.path ?? 'an MDX file'}.`,
        error instanceof Error ? error.message : String(error),
      ].join('\n'),
    )
    return
  }

  codeBlockContentJs = cleanUpCode(codeBlockContentJs.trimEnd(), true)
  codeBlock.value = cleanUpCode(codeBlock.value)

  if (codeBlockContentJs === codeBlock.value) {
    return
  }

  const tsCode = { ...codeBlock, lang: codeBlock.lang }
  const jsCode = {
    ...codeBlock,
    lang: String(codeBlock.lang).replace('t', 'j'),
    value: codeBlockContentJs,
  }

  const replacement = generateChoiceGroupCode([
    { choiceValue: 'JavaScript', children: [jsCode] },
    { choiceValue: 'TypeScript', children: [tsCode] },
  ])

  if (codeBlockReplacedJs === codeBlockContentJs) {
    replacement.attributes.push({ type: 'mdxJsxAttribute', name: 'hide' })
  }

  replacement.data ??= {} as any
  ;(replacement.data as any).customDataChoice = codeBlock.data.customDataChoice
  ;(replacement.data as any).customDataFilter = codeBlock.data.customDataFilter
  parent.children.splice(index, 1, replacement)
}

const replaceFileNameSuffixes = (value: string) => value.replaceAll('.ts', '.js')

const cleanUpCode = (code: string, isJsCode = false) => {
  if (isJsCode) {
    code = correctCodeDiffComments(code)
  }

  return processMagicComments(code)
}

const processMagicComments = (code: string) => {
  const renameCommentRe = /^\s*\/\/\s@docpress-replace\s([^ ]+) ([^ ]+)\n/gm
  const matches = Array.from(code.matchAll(renameCommentRe))

  for (let index = matches.length - 1; index >= 0; index -= 1) {
    const match = matches[index]
    if (!match) {
      continue
    }

    const [fullMatch, renameFrom, renameTo] = match
    code = code.split(fullMatch).join('').replaceAll(renameFrom, renameTo)
  }

  return code.replaceAll('// @docpress-uncomment ', '')
}

const correctCodeDiffComments = (code: string) => {
  return code.replaceAll(/\n\s*\/\/\s\[!code.+\]/g, (codeDiff) => codeDiff.trimStart())
}
