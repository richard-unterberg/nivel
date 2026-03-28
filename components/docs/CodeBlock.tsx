import cm from '@classmatejs/react'
import {
  Children,
  type ComponentPropsWithoutRef,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useId,
  useState,
} from 'react'

type MdxCodeBlockProps = ComponentPropsWithoutRef<'pre'> & {
  'data-language'?: string
  'data-language-label'?: string
  grouped?: boolean
}

type CodeBlockOption = {
  id: string
  label: string
  node: ReactElement<MdxCodeBlockProps>
}

const asTrimmedString = (value: unknown) => {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

const getCodeBlockLabel = (props: MdxCodeBlockProps) => {
  const explicitLabel = asTrimmedString(props['data-language-label'])
  if (explicitLabel) return explicitLabel

  const language = asTrimmedString(props['data-language'])
  return language ? language.toUpperCase() : 'Code'
}

const getCodeBlockId = (node: ReactElement<MdxCodeBlockProps>, index: number) => {
  return typeof node.key === 'string' || typeof node.key === 'number' ? String(node.key) : `block-${index}`
}

const isWhitespaceNode = (node: ReactNode) => {
  return typeof node === 'string' ? node.trim() === '' : false
}

const isMdxCodeBlock = (node: ReactNode): node is ReactElement<MdxCodeBlockProps> => {
  return isValidElement(node) && node.type === MdxCodeBlock
}

const CodeBlockFrame = ({ label, children }: { label: string; children: ReactNode }) => {
  return (
    <CodeBlockOuter>
      <CodeblockHeader>
        <CodeBlockTitle>{label}</CodeBlockTitle>
      </CodeblockHeader>
      {children}
    </CodeBlockOuter>
  )
}

export const MdxCodeBlock = ({ children, className, grouped = false, ...props }: MdxCodeBlockProps) => {
  const label = getCodeBlockLabel(props)
  const codeBlock = (
    <CodeSegment {...props} className={['', className].filter(Boolean).join(' ')}>
      {children}
    </CodeSegment>
  )

  if (grouped) {
    return codeBlock
  }

  return <CodeBlockFrame label={label}>{codeBlock}</CodeBlockFrame>
}

export const CodeGroup = ({ children }: { children: ReactNode }) => {
  const selectId = useId()
  const blocks = Children.toArray(children).reduce<CodeBlockOption[]>((accumulator, child, index) => {
    if (!isMdxCodeBlock(child)) {
      return isWhitespaceNode(child) ? accumulator : accumulator
    }

    accumulator.push({
      id: getCodeBlockId(child, index),
      label: getCodeBlockLabel(child.props),
      node: child,
    })

    return accumulator
  }, [])

  const [selectedId, setSelectedId] = useState(blocks[0]?.id ?? '')
  const activeBlock = blocks.find((block) => block.id === selectedId) ?? blocks[0]

  if (!activeBlock) {
    return <>{children}</>
  }

  return (
    <CodeBlockOuter>
      {blocks.length > 1 && (
        <CodeblockHeader>
          <CodeBlockTitle>{activeBlock.label}</CodeBlockTitle>
          <label className="select select-xs w-fit min-w-28">
            <select
              id={selectId}
              className=""
              value={activeBlock.id}
              onChange={(event) => setSelectedId(event.target.value)}
            >
              {blocks.map((block) => (
                <option key={block.id} value={block.id}>
                  {block.label}
                </option>
              ))}
            </select>
          </label>
        </CodeblockHeader>
      )}
      {cloneElement(activeBlock.node, {
        grouped: true,
        key: activeBlock.id,
      })}
    </CodeBlockOuter>
  )
}

const CodeBlockOuter = cm.div`
  not-prose 
  relative
  mb-6
  min-w-0
  overflow-auto
  flex
  flex-col
  border
  border-base-muted-light
  rounded-box
`

const CodeblockHeader = cm.div`
  flex
  inset-x-4
  top-0
  absolute
  min-h-10
  items-center
  justify-between 
  border-b-1
  border-base-muted-light
`

const CodeBlockTitle = cm.div`
  text-xs 
  font-semibold 
  font-mono
  text-base-muted
`

const CodeSegment = cm.pre`
  flex-1 w-full max-w-full 
  min-w-0 overflow-auto 
  rounded-box p-4 pt-14 text-sm
`
