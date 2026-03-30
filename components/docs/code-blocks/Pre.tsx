export { Pre }

import {
  Children,
  type ComponentPropsWithoutRef,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useRef,
} from 'react'
import { CodeBlockCopyButton, trimTrailingWhitespace } from './CopyButton'
import { useIsInCodeBlockGroup } from './context'

type PreProps = ComponentPropsWithoutRef<'pre'> & {
  'data-language'?: string
  'data-language-label'?: string
  'file-added'?: string
  'file-removed'?: string
  'hide-menu'?: string
}

const asTrimmedString = (value: unknown) => {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

const getLanguageFromChildren = (children: ReactNode) => {
  const firstChild = Children.toArray(children)[0]
  if (!isValidElement(firstChild)) {
    return null
  }

  const props = (firstChild as ReactElement<{ className?: string; 'data-language'?: string }>).props
  const explicitLanguage = asTrimmedString(props['data-language'])
  if (explicitLanguage) {
    return explicitLanguage
  }

  const classNames = typeof props.className === 'string' ? props.className.split(/\s+/) : []
  const languageClassName = classNames.find((className) => className.startsWith('language-'))
  return languageClassName ? languageClassName.slice('language-'.length) : null
}

const getLanguageLabel = (props: PreProps) => {
  const explicitLabel = asTrimmedString(props['data-language-label'])
  if (explicitLabel) {
    return explicitLabel
  }

  const explicitLanguage = asTrimmedString(props['data-language']) ?? getLanguageFromChildren(props.children)
  return explicitLanguage ? explicitLanguage.toUpperCase() : 'CODE'
}

function Pre({ children, className, ...props }: PreProps) {
  const preRef = useRef<HTMLPreElement>(null)
  const isInChoiceGroup = useIsInCodeBlockGroup()
  const label = getLanguageLabel(props)
  const fileState = props['file-added'] ? 'added' : props['file-removed'] ? 'removed' : null
  const hideMenu = props['hide-menu'] === 'true'

  const copyButton =
    hideMenu || isInChoiceGroup ? null : (
      <CodeBlockCopyButton
        onCopy={async () => {
          const text = trimTrailingWhitespace(preRef.current?.textContent ?? '')

          try {
            await navigator.clipboard.writeText(text)
            return true
          } catch {
            return false
          }
        }}
      />
    )

  const codeBlock = (
    <div
      className={[
        'group relative not-prose overflow-hidden',
        isInChoiceGroup ? '' : 'mb-6 rounded-box border border-base-muted-light bg-base-100/60',
      ]
        .filter(Boolean)
        .join(' ')}
      data-code-block-frame=""
      data-file-state={fileState ?? undefined}
    >
      {!isInChoiceGroup && (
        <div
          className="flex min-h-10 items-center justify-between gap-3 border-b border-base-muted-light bg-base-muted-superlight! px-4"
          data-code-block-header=""
        >
          <div className="text-xs font-semibold font-mono tracking-[0.08em] text-base-muted">{label}</div>
          {copyButton}
        </div>
      )}
      <pre
        {...props}
        ref={preRef}
        className={['doc-code-pre m-0 overflow-x-auto p-4 text-sm bg-base-200!', className].filter(Boolean).join(' ')}
        data-code-block-content=""
      >
        {children}
      </pre>
    </div>
  )

  if (isInChoiceGroup) {
    return codeBlock
  }

  return codeBlock
}
