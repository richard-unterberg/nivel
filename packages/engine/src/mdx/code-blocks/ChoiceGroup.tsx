export { ChoiceGroup }

import { Children, isValidElement, type ReactElement, type ReactNode, useId, useRef } from 'react'
import { dispatchNivelAction } from '../../shared/nivelActionEvents.js'
import { CodeBlockHeaderMeta } from './CodeBlockHeaderMeta.js'
import { CodeBlockCopyButton, trimTrailingWhitespace } from './CopyButton.js'
import { CodeBlockGroupProvider } from './context.js'
import { useSelectedChoice } from './useSelectedChoice.js'

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

const getActiveCodeBlockMeta = (node: ReactNode): { env: string | null; hideCopy: boolean; title: string | null } => {
  for (const child of Children.toArray(node)) {
    if (!isValidElement(child)) {
      continue
    }

    const props = child.props as {
      children?: ReactNode
      'data-code-env'?: string
      'data-code-title'?: string
      'hide-menu'?: string
    }
    const env = asTrimmedString(props['data-code-env'])
    const title = asTrimmedString(props['data-code-title'])
    const hideCopy = props['hide-menu'] === 'true'

    if (title || env || hideCopy) {
      return { env, hideCopy, title }
    }

    const nestedMeta = getActiveCodeBlockMeta(props.children)
    if (nestedMeta.title || nestedMeta.env || nestedMeta.hideCopy) {
      return nestedMeta
    }
  }

  return { env: null, hideCopy: false, title: null }
}

const ChoiceGroup = ({
  children,
  choiceGroup,
  hide = false,
}: {
  children: ReactNode
  choiceGroup: ChoiceGroupDescriptor
  hide?: boolean
  lvl?: number
}) => {
  const [selectedChoice, setSelectedChoice] = useSelectedChoice(choiceGroup.name, choiceGroup.default)
  const bodyRef = useRef<HTMLDivElement>(null)
  const selectId = useId()
  const labelId = `${selectId}-label`
  // const previousPositionRef = useRestoreScroll([selectedChoice])
  const choiceElements = Children.toArray(children).filter(isChoiceElement)
  const activeChoiceElement =
    choiceElements.find((choiceElement) => choiceElement.props['data-choice-value'] === selectedChoice) ??
    choiceElements[0]

  if (!activeChoiceElement) {
    return <>{children}</>
  }

  const activeCodeBlockMeta = getActiveCodeBlockMeta(activeChoiceElement.props.children)
  const headerLabel = activeCodeBlockMeta.title ?? activeChoiceElement.props['data-choice-value'] ?? ''

  if (hide) {
    return <>{activeChoiceElement.props.children}</>
  }

  return (
    <div
      data-choice-group-outer
      data-nivel-component="code-choice-group"
      className="my-6 flex h-full min-w-0 max-w-full flex-col overflow-hidden rounded-box border border-base-muted-light"
    >
      <div
        className="not-prose flex min-h-10 items-center relative justify-between gap-3 border-b border-base-muted-light bg-base-muted-superlight px-4"
        data-choice-group-header
      >
        <CodeBlockHeaderMeta label={headerLabel} env={activeCodeBlockMeta.env} />
        <div className="flex items-center gap-1">
          <label className="select select-xs min-w-28 w-fit" htmlFor={selectId}>
            <span id={labelId} className="sr-only">
              Choose code example variant
            </span>
            <select
              id={selectId}
              aria-labelledby={labelId}
              name={`choicesFor-${choiceGroup.name}`}
              data-nivel-action="code.choice_change"
              value={activeChoiceElement.props['data-choice-value']}
              onChange={(event) => {
                const choice = event.currentTarget.value
                setSelectedChoice(choice)
                dispatchNivelAction(event.currentTarget, {
                  action: 'code.choice_change',
                  choice,
                  choiceGroup: choiceGroup.name,
                  component: 'code-choice-group',
                })
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
              actionDetail={{
                action: 'code.copy',
                choice: activeChoiceElement.props['data-choice-value'] ?? null,
                choiceGroup: choiceGroup.name,
                component: 'code-choice-group',
                env: activeCodeBlockMeta.env,
                label: headerLabel,
              }}
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
      <div
        ref={bodyRef}
        className="h-full min-w-0 max-w-full flex-1 bg-base-200! [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
      >
        <CodeBlockGroupProvider value={true}>{activeChoiceElement.props.children}</CodeBlockGroupProvider>
      </div>
    </div>
  )
}
