export { remarkChoiceGroup }

import { visit } from 'unist-util-visit'
import { generateChoiceGroupCode } from './generateChoiceGroupCode'
import { parseMetaString } from './meta'

function remarkChoiceGroup() {
  return (tree: unknown) => {
    visit(tree as any, (node: any) => {
      if (node.type === 'code' && node.meta) {
        const meta = parseMetaString(node.meta, ['choice'])
        const choice = meta.props.choice
        node.meta = meta.rest

        if (choice) {
          node.data ??= {}
          node.data.customDataChoice = choice
          node.data.customDataFilter = `code-${node.lang ?? ''}`
        }
      }

      if (node.type === 'containerDirective' && node.name === 'Choice') {
        const choice = typeof node.attributes?.id === 'string' ? node.attributes.id : null
        if (!choice) {
          return
        }

        node.data ??= {}
        node.data.customDataChoice = choice
        node.data.customDataFilter = node.type
        node.attributes = {}
      }
    })

    visit(tree as any, (node: any) => {
      if (!Array.isArray(node.children)) {
        return
      }

      let start = -1
      let end = 0

      const processRange = () => {
        if (start === -1 || start === end) {
          return
        }

        const nodes = node.children.slice(start, end)
        const replacements = filterChoices(nodes).map((choiceNodes) => generateChoiceGroupCode(choiceNodes, node))
        node.children.splice(start, end - start, ...replacements)
        end = start + replacements.length
        start = -1
      }

      for (; end < node.children.length; end += 1) {
        const child = node.children[end]

        if (!['code', 'mdxJsxFlowElement', 'containerDirective'].includes(child?.type)) {
          processRange()
          continue
        }

        if (!child.data?.customDataChoice) {
          processRange()
          continue
        }

        if (start === -1) {
          start = end
        }
      }

      processRange()
    })
  }
}

const filterChoices = (nodes: any[]) => {
  const filteredChoices: Array<Array<{ choiceValue: string; children: any[] }>> = []
  const filters = [...new Set(nodes.map((node) => node.data?.customDataFilter).filter(Boolean))]

  for (const filter of filters) {
    const nodesByChoice = new Map<string, any[]>()

    for (const node of nodes.filter((candidate) => candidate.data?.customDataFilter === filter)) {
      const choice = node.data?.customDataChoice
      if (!choice) {
        continue
      }

      node.data.customDataChoice = undefined
      const choiceNodes = nodesByChoice.get(choice) ?? []
      choiceNodes.push(node)
      nodesByChoice.set(choice, choiceNodes)
    }

    filteredChoices.push([...nodesByChoice].map(([choiceValue, children]) => ({ choiceValue, children })))
  }

  return filteredChoices
}
