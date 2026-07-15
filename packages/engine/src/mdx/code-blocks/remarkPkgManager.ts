import convert_ from 'npm-to-yarn'
import { visit } from 'unist-util-visit'
import type { ChoiceGroupElement, CodeNode, ParentNode, RootNode } from '../ast.js'
import { generateChoiceGroupCode } from './generateChoiceGroupCode.js'
import { parseMetaString } from './meta.js'

const convert: (input: string, target: 'npm' | 'pnpm' | 'bun' | 'yarn') => string = convert_

const PACKAGE_MANAGERS = ['pnpm', 'Bun', 'Yarn'] as const

export const remarkPkgManager = () => {
  return (tree: RootNode) => {
    visit(tree, 'code', (node: CodeNode, index: number | undefined, parent: ParentNode | undefined) => {
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

      if (node.meta) {
        const meta = parseMetaString(node.meta, ['choice'])
        if (meta.props.choice) {
          return
        }
      }

      node.value = node.value.replaceAll('npm i ', 'npm install ')

      const nodes = new Map<string, CodeNode>()
      nodes.set('npm', node)

      for (const packageManager of PACKAGE_MANAGERS) {
        const packageManagerNode: CodeNode = {
          ...node,
          value: convert(node.value, packageManager.toLowerCase() as 'pnpm' | 'bun' | 'yarn'),
        }
        nodes.set(packageManager, packageManagerNode)
      }

      const replacement = generateChoiceGroupCode(
        [...nodes].map(([choiceValue, childNode]) => ({
          choiceValue,
          children: [childNode],
        })),
      ) as ChoiceGroupElement

      parent.children.splice(index, 1, replacement)
    })
  }
}
