import { cmMerge } from '@classmatejs/react'
import { Fragment, type ReactNode } from 'react'

type RenderInlineMarkdownOptions = {
  codeClassName?: string
}

export const renderInlineMarkdown = (
  value: ReactNode,
  { codeClassName = 'font-medium' }: RenderInlineMarkdownOptions = {},
): ReactNode => {
  if (typeof value !== 'string') {
    return value
  }

  return value.split(/(`[^`]+`)/g).map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        // biome-ignore lint/suspicious/noArrayIndexKey: local presentational split
        <code className={cmMerge(codeClassName)} key={index}>
          {part.slice(1, -1)}
        </code>
      )
    }

    // biome-ignore lint/suspicious/noArrayIndexKey: local presentational split
    return <Fragment key={index}>{part}</Fragment>
  })
}
