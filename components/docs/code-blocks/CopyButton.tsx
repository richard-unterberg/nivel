export { CodeBlockCopyButton, trimTrailingWhitespace }

import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

const trimTrailingWhitespace = (text: string) => {
  return text
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
}

function CodeBlockCopyButton({
  onCopy,
  className = '',
}: {
  onCopy: () => Promise<boolean> | boolean
  className?: string
}) {
  const [copyState, setCopyState] = useState<'idle' | 'success' | 'error'>('idle')

  return (
    <button
      type="button"
      className={['btn btn-ghost btn-xs h-8 min-h-8 px-2 text-base-muted hover:text-base-content', className]
        .filter(Boolean)
        .join(' ')}
      onClick={async () => {
        const success = await onCopy()
        setCopyState(success ? 'success' : 'error')
        window.setTimeout(() => setCopyState('idle'), 900)
      }}
      aria-label={copyState === 'idle' ? 'Copy to clipboard' : copyState === 'success' ? 'Copied' : 'Copy failed'}
    >
      {copyState === 'success' ? <Check size={14} /> : <Copy size={14} />}
    </button>
  )
}
