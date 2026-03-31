export { ChoiceGroup }

import { Children, isValidElement, type ReactElement, type ReactNode, useRef } from 'react'
import { CodeBlockCopyButton, trimTrailingWhitespace } from './CopyButton'
import { CodeBlockGroupProvider } from './context'
import { useRestoreScroll } from './useRestoreScroll'
import { useSelectedChoice } from './useSelectedChoice'

type ChoiceGroupDescriptor = {
  default: string
  disabled: string[]
  name: string
  choices: string[]
}

type ChoiceElementProps = {
  children?: ReactNode
  'data-choice-value'?: string
}

const isChoiceElement = (node: ReactNode): node is ReactElement<ChoiceElementProps> => {
  return isValidElement<ChoiceElementProps>(node) && typeof node.props?.['data-choice-value'] === 'string'
}

const asTrimmedString = (value: unknown) => {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

const getActiveCodeBlockMeta = (node: ReactNode): { hideCopy: boolean; title: string | null } => {
  for (const child of Children.toArray(node)) {
    if (!isValidElement(child)) {
      continue
    }

    const props = child.props as {
      children?: ReactNode
      'data-code-title'?: string
      'hide-menu'?: string
    }
    const title = asTrimmedString(props['data-code-title'])
    const hideCopy = props['hide-menu'] === 'true'

    if (title || hideCopy) {
      return { hideCopy, title }
    }

    const nestedMeta = getActiveCodeBlockMeta(props.children)
    if (nestedMeta.title || nestedMeta.hideCopy) {
      return nestedMeta
    }
  }

  return { hideCopy: false, title: null }
}

function ChoiceGroup({
  children,
  choiceGroup,
  hide = false,
}: {
  children: ReactNode
  choiceGroup: ChoiceGroupDescriptor
  hide?: boolean
  lvl?: number
}) {
  const [selectedChoice, setSelectedChoice] = useSelectedChoice(choiceGroup.name, choiceGroup.default)
  const bodyRef = useRef<HTMLDivElement>(null)
  const previousPositionRef = useRestoreScroll([selectedChoice])
  const choiceElements = Children.toArray(children).filter(isChoiceElement)
  const activeChoiceElement =
    choiceElements.find((choiceElement) => choiceElement.props['data-choice-value'] === selectedChoice) ??
    choiceElements[0]

  if (!activeChoiceElement) {
    return <>{children}</>
  }

  const activeCodeBlockMeta = getActiveCodeBlockMeta(activeChoiceElement.props.children)
  const headerLabel = activeCodeBlockMeta.title ?? activeChoiceElement.props['data-choice-value']

  if (hide) {
    return <>{activeChoiceElement.props.children}</>
  }

  return (
    <div className="overflow-hidden rounded-box border border-base-muted-light flex flex-col mt-5 mb-5 h-full">
      <div
        className="not-prose flex min-h-10 items-center justify-between gap-3 border-b border-base-muted-light bg-base-muted-superlight px-4"
        data-choice-group-header
      >
        <div className="text-xs font-semibold font-mono tracking-[0.08em] text-base-muted">{headerLabel}</div>
        <div className="flex items-center gap-1">
          <label className="select select-xs w-fit min-w-28">
            <select
              name={`choicesFor-${choiceGroup.name}`}
              value={activeChoiceElement.props['data-choice-value']}
              onChange={(event) => {
                previousPositionRef.current = {
                  top: event.currentTarget.getBoundingClientRect().top,
                  element: event.currentTarget,
                }
                setSelectedChoice(event.currentTarget.value)
              }}
            >
              {choiceGroup.choices.map((choice) => (
                <option key={choice} value={choice} disabled={choiceGroup.disabled.includes(choice)}>
                  {choice}
                </option>
              ))}
            </select>
          </label>
          {!activeCodeBlockMeta.hideCopy && (
            <CodeBlockCopyButton
              onCopy={async () => {
                const text = trimTrailingWhitespace(bodyRef.current?.textContent ?? '')

                try {
                  await navigator.clipboard.writeText(text)
                  return true
                } catch {
                  return false
                }
              }}
            />
          )}
        </div>
      </div>
      <div ref={bodyRef} className="flex-1 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 h-full bg-base-200!">
        <CodeBlockGroupProvider value={true}>{activeChoiceElement.props.children}</CodeBlockGroupProvider>
      </div>
    </div>
  )
}
