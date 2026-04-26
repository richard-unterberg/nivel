export { Pre }

import { cmMerge } from '@classmatejs/react'
import {
  Children,
  type ComponentPropsWithoutRef,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useRef,
} from 'react'
import { CodeBlockHeaderMeta } from './CodeBlockHeaderMeta.js'
import { CodeBlockCopyButton, trimTrailingWhitespace } from './CopyButton.js'
import { MermaidDiagram } from './MermaidDiagram.js'
import { useIsInCodeBlockGroup } from './context.js'

type PreProps = ComponentPropsWithoutRef<'pre'> & {
  'data-code-env'?: string
  'data-code-title'?: string
  'data-language'?: string
  'data-language-label'?: string
  'file-added'?: string
  'file-removed'?: string
  'hide-menu'?: string
  render?: string
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

const getNodeText = (node: ReactNode): string => {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node)
  }

  if (Array.isArray(node)) {
    return node.map((child) => getNodeText(child)).join('')
  }

  if (!isValidElement(node)) {
    return ''
  }

  return getNodeText((node as ReactElement<{ children?: ReactNode }>).props.children)
}

const Pre = ({ children, className, ...props }: PreProps) => {
  const preRef = useRef<HTMLPreElement>(null)
  const isInChoiceGroup = useIsInCodeBlockGroup()
  const language = asTrimmedString(props['data-language']) ?? getLanguageFromChildren(children)
  const label =
    asTrimmedString(props['data-code-title']) ??
    getLanguageLabel({ ...props, children, 'data-language': language ?? undefined })
  const env = asTrimmedString(props['data-code-env'])
  const fileState = props['file-added'] ? 'added' : props['file-removed'] ? 'removed' : null
  const hideMenu = props['hide-menu'] === 'true'
  const shouldRenderMermaid = language === 'mermaid' && props.render === 'true'
  const sourceText = trimTrailingWhitespace(getNodeText(children))

  const copyButton =
    hideMenu || isInChoiceGroup ? null : (
      <CodeBlockCopyButton
        onCopy={async () => {
          const text = shouldRenderMermaid ? sourceText : trimTrailingWhitespace(preRef.current?.textContent ?? '')

          try {
            await navigator.clipboard.writeText(text)
            return true
          } catch {
            return false
          }
        }}
      />
    )

  return (
    <div
      className={cmMerge(
        'group relative h-full min-w-0 max-w-full not-prose overflow-hidden',
        isInChoiceGroup ? '' : 'rounded-box border border-base-muted-light',
        className,
      )}
      data-code-block-frame=""
      data-file-state={fileState ?? undefined}
    >
      {!isInChoiceGroup && (
        <div
          className="flex min-h-10 relative items-center justify-between gap-3 border-b border-base-muted-light bg-base-muted-superlight! px-4"
          data-code-block-header=""
        >
          <CodeBlockHeaderMeta label={label} env={env} />
          {copyButton}
        </div>
      )}
      {shouldRenderMermaid ? (
        <MermaidDiagram className="min-w-0" source={sourceText} />
      ) : (
        <pre
          {...props}
          ref={preRef}
          className={cmMerge(
            'doc-code-pre m-0 h-full min-w-0 max-w-full overflow-x-auto bg-base-200! p-4 text-sm',
            className,
          )}
          data-code-block-content=""
        >
          {children}
        </pre>
      )}
    </div>
  )
}
