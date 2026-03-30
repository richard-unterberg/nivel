export { CodeBlockTransformer }

import type { ReactNode } from 'react'

type LineBreak = 'white-space' | 'break-word'

function CodeBlockTransformer({ children, lineBreak }: { children: ReactNode; lineBreak: LineBreak }) {
  const className = `with-line-break_${lineBreak}` as const
  return <div className={className}>{children}</div>
}
