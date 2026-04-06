export { FileAdded, FileRemoved }

import type { ReactNode } from 'react'

const FileAdded = ({ children }: { children: ReactNode }) => {
  return <div className="doc-code-file-state doc-code-file-added">{children}</div>
}

const FileRemoved = ({ children }: { children: ReactNode }) => {
  return <div className="doc-code-file-state doc-code-file-removed">{children}</div>
}
