export { remarkPkgManager }

import convert_ from 'npm-to-yarn'
import { visit } from 'unist-util-visit'
import { generateChoiceGroupCode } from './generateChoiceGroupCode'
import { parseMetaString } from './meta'

const convert: (input: string, target: 'npm' | 'pnpm' | 'bun' | 'yarn') => string = convert_

const PACKAGE_MANAGERS = ['pnpm', 'Bun', 'Yarn'] as const

function remarkPkgManager() {
  return (tree: unknown) => {
    visit(tree as any, 'code', (node: any, index: number | undefined, parent: any) => {
      if (!parent || typeof index !== 'number') {
        return
      }

      if (!['bash', 'sh', 'shell'].includes(node.lang ?? '')) {
        return
      }

      if (node.value.includes('pnpm')) {
        return
      }

      if (!node.value.includes('npm ') && !node.value.includes('npx ')) {
        return
      }

      let choice: string | undefined
      if (node.meta) {
        const meta = parseMetaString(node.meta, ['choice'])
        choice = meta.props.choice
        node.meta = meta.rest
      }

      node.value = node.value.replaceAll('npm i ', 'npm install ')

      const nodes = new Map<string, any>()
      nodes.set('npm', node)

      for (const packageManager of PACKAGE_MANAGERS) {
        nodes.set(packageManager, {
          ...node,
          value: convert(node.value, packageManager.toLowerCase() as 'pnpm' | 'bun' | 'yarn'),
        })
      }

      const replacement = generateChoiceGroupCode(
        [...nodes].map(([choiceValue, childNode]) => ({ choiceValue, children: [childNode] })),
      )

      replacement.data ??= {} as any
      ;(replacement.data as any).customDataChoice = choice
      ;(replacement.data as any).customDataFilter = replacement.type
      parent.children.splice(index, 1, replacement)
    })
  }
}
