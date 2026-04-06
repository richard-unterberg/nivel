import { valueToEstree } from 'estree-util-value-to-estree'
import type { MdxJsxAttribute, MdxJsxFlowElement } from 'mdast-util-mdx-jsx'

type ChoiceNode = {
  choiceValue: string
  children: any[]
}

const BUILT_IN_CHOICE_GROUPS = {
  codeLang: {
    choices: ['JavaScript', 'TypeScript'],
    default: 'JavaScript',
  },
  pkgManager: {
    choices: ['npm', 'pnpm', 'Bun', 'Yarn'],
    default: 'npm',
  },
} as const

const getChoiceGroup = (choicesRaw: string[]) => {
  const choices = [...new Set(choicesRaw.filter(Boolean))]

  for (const [name, group] of Object.entries(BUILT_IN_CHOICE_GROUPS)) {
    if (!choices.every((choice) => group.choices.includes(choice as never))) {
      continue
    }

    return {
      name,
      choices: group.choices,
      default: group.default,
      disabled: group.choices.filter((choice) => !choices.includes(choice)),
    }
  }

  return {
    name: `custom:${choices.join('|')}`,
    choices,
    default: choices[0] ?? '',
    disabled: [] as string[],
  }
}

export const generateChoiceGroupCode = (choiceNodes: ChoiceNode[], parent?: any): MdxJsxFlowElement => {
  const choiceGroup = getChoiceGroup(choiceNodes.map((choiceNode) => choiceNode.choiceValue))
  const mergedChoiceNodes = choiceGroup.choices.map((choice) => {
    const choiceNode = choiceNodes.find((node) => node.choiceValue === choice)

    return {
      choiceValue: choice,
      children: choiceNode?.children ?? [],
    }
  })

  const attributes: MdxJsxAttribute[] = [
    {
      type: 'mdxJsxAttribute',
      name: 'choiceGroup',
      value: {
        type: 'mdxJsxAttributeValueExpression',
        value: '',
        data: {
          estree: {
            type: 'Program',
            sourceType: 'module',
            comments: [],
            body: [
              {
                type: 'ExpressionStatement',
                expression: valueToEstree(choiceGroup) as any,
              } as any,
            ],
          } as any,
        },
      },
    },
  ]

  if (choiceNodes.length === 1) {
    attributes.push({ type: 'mdxJsxAttribute', name: 'hide' })
  }

  attributes.push({
    type: 'mdxJsxAttribute',
    name: 'lvl',
    value: `${parent?.type === 'mdxJsxFlowElement' ? 1 : 0}`,
  })

  const children: MdxJsxFlowElement[] = mergedChoiceNodes.map((choiceNode) => {
    const choiceChildren =
      choiceNode.children.length > 0 && choiceNode.children.every((node) => node.type === 'containerDirective')
        ? choiceNode.children.flatMap((node) => node.children ?? [])
        : choiceNode.children

    for (const child of choiceChildren) {
      increaseLvl(child)
    }

    return {
      type: 'mdxJsxFlowElement',
      name: 'div',
      attributes: [
        {
          type: 'mdxJsxAttribute',
          name: 'data-choice-value',
          value: choiceNode.choiceValue,
        },
        { type: 'mdxJsxAttribute', name: 'className', value: 'choice' },
      ],
      children: choiceChildren,
    }
  })

  return {
    type: 'mdxJsxFlowElement',
    name: 'ChoiceGroup',
    attributes,
    children,
  }
}

const increaseLvl = (node: any) => {
  if (node?.type !== 'mdxJsxFlowElement' || node.name !== 'ChoiceGroup') {
    return
  }

  const attribute = node.attributes.find(
    (candidate: any) => candidate.type === 'mdxJsxAttribute' && candidate.name === 'lvl',
  )

  if (typeof attribute?.value === 'string') {
    attribute.value = `${Number(attribute.value) + 1}`
  }
}
