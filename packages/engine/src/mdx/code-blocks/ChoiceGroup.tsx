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

type ChoiceGroupProps = {
  children: ReactNode
  choiceGroup: ChoiceGroupDescriptor
  hide?: boolean
  lvl?: number
}

type CodeBlockMeta = { env: string | null; hideCopy: boolean; title: string | null }

const isChoiceElement = (node: ReactNode): node is ReactElement<ChoiceElementProps> => {
  return isValidElement<ChoiceElementProps>(node) && typeof node.props?.['data-choice-value'] === 'string'
}

const isNestedChoiceGroup = (node: ReactNode): node is ReactElement<ChoiceGroupProps> => {
  return isValidElement<ChoiceGroupProps>(node) && node.type === ChoiceGroup
}

const asTrimmedString = (value: unknown) => {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

const getActiveCodeBlockMeta = (node: ReactNode): CodeBlockMeta => {
  for (const child of Children.toArray(node)) {
    if (!isValidElement(child)) continue

    const props = child.props as {
      children?: ReactNode
      'data-code-env'?: string
      'data-code-title'?: string
      'hide-menu'?: string
    }
    const env = asTrimmedString(props['data-code-env'])
    const title = asTrimmedString(props['data-code-title'])
    const hideCopy = props['hide-menu'] === 'true'

    if (title || env || hideCopy) return { env, hideCopy, title }

    const nestedMeta = getActiveCodeBlockMeta(props.children)
    if (nestedMeta.title || nestedMeta.env || nestedMeta.hideCopy) return nestedMeta
  }

  return { env: null, hideCopy: false, title: null }
}

const getChoiceElements = (children: ReactNode) => Children.toArray(children).filter(isChoiceElement)

const getActiveChoiceElement = (children: ReactNode, selectedChoice: string) => {
  const choiceElements = getChoiceElements(children)
  return (
    choiceElements.find((choiceElement) => choiceElement.props['data-choice-value'] === selectedChoice) ??
    choiceElements[0]
  )
}

const findNestedChoiceGroup = (node: ReactNode): ReactElement<ChoiceGroupProps> | null => {
  for (const child of Children.toArray(node)) {
    if (isNestedChoiceGroup(child)) return child
    if (!isValidElement(child)) continue

    const nested = findNestedChoiceGroup((child.props as { children?: ReactNode }).children)
    if (nested) return nested
  }

  return null
}

const ChoiceSelect = ({
  choiceGroup,
  selectedChoice,
  setSelectedChoice,
}: {
  choiceGroup: ChoiceGroupDescriptor
  selectedChoice: string
  setSelectedChoice: (choice: string) => void
}) => {
  const selectId = useId()
  const labelId = `${selectId}-label`

  return (
    <label className="select select-xs min-w-28 w-fit" htmlFor={selectId}>
      <span id={labelId} className="sr-only">
        Choose code example variant
      </span>
      <select
        id={selectId}
        aria-labelledby={labelId}
        name={`choicesFor-${choiceGroup.name}`}
        data-nivel-action="code.choice_change"
        value={selectedChoice}
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
  )
}

const ChoiceGroupFrame = ({
  activeCodeBlockMeta,
  body,
  choices,
  copyChoice,
  copyChoiceGroup,
  headerLabel,
}: {
  activeCodeBlockMeta: CodeBlockMeta
  body: ReactNode
  choices: ReactNode
  copyChoice: string | null
  copyChoiceGroup: string
  headerLabel: string
}) => {
  const bodyRef = useRef<HTMLDivElement>(null)

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
          {choices}
          {!activeCodeBlockMeta.hideCopy && (
            <CodeBlockCopyButton
              actionDetail={{
                action: 'code.copy',
                choice: copyChoice,
                choiceGroup: copyChoiceGroup,
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
        <CodeBlockGroupProvider value={true}>{body}</CodeBlockGroupProvider>
      </div>
    </div>
  )
}

const CombinedChoiceGroup = ({
  activeOuterChoice,
  nestedChoiceGroup,
  outerChoiceGroup,
  outerSelect,
}: {
  activeOuterChoice: ReactElement<ChoiceElementProps>
  nestedChoiceGroup: ReactElement<ChoiceGroupProps>
  outerChoiceGroup: ChoiceGroupDescriptor
  outerSelect: ReactNode
}) => {
  const [selectedNestedChoice, setSelectedNestedChoice] = useSelectedChoice(
    nestedChoiceGroup.props.choiceGroup.name,
    nestedChoiceGroup.props.choiceGroup.default,
  )
  const activeNestedChoice = getActiveChoiceElement(nestedChoiceGroup.props.children, selectedNestedChoice)
  if (!activeNestedChoice) return <>{activeOuterChoice.props.children}</>

  const meta = getActiveCodeBlockMeta(activeNestedChoice.props.children)
  const outerLabel = activeOuterChoice.props['data-choice-value'] ?? ''
  const languageLabel = (activeNestedChoice.props['data-choice-value'] ?? '').toLowerCase()
  const headerLabel = meta.title ? `${meta.title} / ${languageLabel}` : `${outerLabel} - ${languageLabel}`

  return (
    <ChoiceGroupFrame
      activeCodeBlockMeta={meta}
      body={activeNestedChoice.props.children}
      choices={
        <>
          {outerSelect}
          <ChoiceSelect
            choiceGroup={nestedChoiceGroup.props.choiceGroup}
            selectedChoice={activeNestedChoice.props['data-choice-value'] ?? ''}
            setSelectedChoice={setSelectedNestedChoice}
          />
        </>
      }
      copyChoice={activeNestedChoice.props['data-choice-value'] ?? null}
      copyChoiceGroup={`${outerChoiceGroup.name}+${nestedChoiceGroup.props.choiceGroup.name}`}
      headerLabel={headerLabel}
    />
  )
}

const ChoiceGroup = ({ children, choiceGroup, hide = false }: ChoiceGroupProps) => {
  const [selectedChoice, setSelectedChoice] = useSelectedChoice(choiceGroup.name, choiceGroup.default)
  const activeChoiceElement = getActiveChoiceElement(children, selectedChoice)
  if (!activeChoiceElement) return <>{children}</>
  if (hide) return <>{activeChoiceElement.props.children}</>

  const selectedValue = activeChoiceElement.props['data-choice-value'] ?? ''
  const select = (
    <ChoiceSelect choiceGroup={choiceGroup} selectedChoice={selectedValue} setSelectedChoice={setSelectedChoice} />
  )
  const nestedChoiceGroup = findNestedChoiceGroup(activeChoiceElement.props.children)

  if (nestedChoiceGroup && !nestedChoiceGroup.props.hide) {
    return (
      <CombinedChoiceGroup
        activeOuterChoice={activeChoiceElement}
        nestedChoiceGroup={nestedChoiceGroup}
        outerChoiceGroup={choiceGroup}
        outerSelect={select}
      />
    )
  }

  const meta = getActiveCodeBlockMeta(activeChoiceElement.props.children)
  const headerLabel = meta.title ?? selectedValue
  return (
    <ChoiceGroupFrame
      activeCodeBlockMeta={meta}
      body={activeChoiceElement.props.children}
      choices={select}
      copyChoice={selectedValue || null}
      copyChoiceGroup={choiceGroup.name}
      headerLabel={headerLabel}
    />
  )
}
