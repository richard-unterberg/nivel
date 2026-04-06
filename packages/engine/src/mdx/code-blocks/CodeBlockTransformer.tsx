export { CodeBlockTransformer }
export type { LineBreak }

import type { ReactNode } from 'react'

type LineBreak = 'white-space' | 'break-word'

const CodeBlockTransformer = ({ children, lineBreak }: { children: ReactNode; lineBreak: LineBreak }) => {
  const className = `with-line-break_${lineBreak}` as const
  return <div className={className}>{children}</div>
}
