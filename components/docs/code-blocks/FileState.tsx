export { FileAdded, FileRemoved }

import type { ReactNode } from 'react'

function FileAdded({ children }: { children: ReactNode }) {
  return <div className="doc-code-file-state doc-code-file-added">{children}</div>
}

function FileRemoved({ children }: { children: ReactNode }) {
  return <div className="doc-code-file-state doc-code-file-removed">{children}</div>
}
