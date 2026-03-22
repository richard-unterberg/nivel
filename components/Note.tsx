export { Advanced, Construction, Contribution, Danger, Info, NoteWithCustomIcon, NoteWithoutIcon, Warning }

/* Use markdown instead:
 * ```diff
 * - <Note>Some note</Note>
 * + > Some note
 * ```
export { Note }
*/

import {
  Brain,
  Construction as ConstructionIcon,
  Heart,
  Info as InfoIcon,
  OctagonAlert,
  TriangleAlert,
} from 'lucide-react'
import React from 'react'
import { assert } from '@/lib/util/assert'

type Props = {
  children: React.ReactNode
  style?: React.CSSProperties
}
function Warning(props: Props) {
  return <NoteGeneric type="warning" {...props} />
}
function Advanced(props: Props) {
  return <NoteGeneric type="advanced" {...props} />
}
function Construction(props: Props) {
  return <NoteGeneric type="construction" {...props} />
}
function Contribution(props: Props) {
  return <NoteGeneric type="contribution" {...props} />
}
function Danger(props: Props) {
  return <NoteGeneric type="danger" {...props} />
}
function Info(props: Props) {
  return <NoteGeneric type="info" {...props} />
}
function NoteWithoutIcon(props: Props) {
  return <NoteGeneric icon={null} {...props} />
}
type CustomIcon = React.JSX.Element | string
function NoteWithCustomIcon(props: Props & { icon: CustomIcon }) {
  const { icon } = props
  if (!icon) throw new Error(`<NoteWithCustomIcon icon={/*...*/}> property 'icon' is \`${icon}\` which is forbidden`)
  return <NoteGeneric {...props} />
}

function NoteGeneric({
  type,
  icon,
  children,
  style,
}: Props & {
  icon?: null | CustomIcon
  type?: 'danger' | 'warning' | 'construction' | 'contribution' | 'advanced' | 'info'
}) {
  assert(icon === null || icon || type, { icon, type })

  let className = 'custom-icon'
  if (type) {
    className = `${className} pt-2 rounded-box border border-px px-4 flex gap-2 items-start`
  }
  if (!icon && type) {
    let classColor = ''
    if (type === 'danger') {
      icon = <OctagonAlert size={18} />
      classColor = 'bg-error/10 border-error/20 dark:bg-error/20 dark:border-error/40'
    }
    if (type === 'warning') {
      icon = <TriangleAlert size={18} />
      classColor = 'bg-warning/20 border-warning/40 dark:bg-warning/20 dark:border-warning/40'
    }
    if (type === 'construction') {
      icon = <ConstructionIcon size={18} />
      classColor = 'bg-warning/20 border-warning/40 dark:bg-warning/20 dark:border-warning/40'
    }
    if (type === 'contribution') {
      icon = <Heart size={18} />
      classColor = 'bg-success/10 border-success/20 dark:bg-success/20 dark:border-success/40'
    }
    if (type === 'advanced') {
      icon = <Brain size={18} />
      classColor = 'bg-error/10 border-error/20 dark:bg-error/20 dark:border-error/40'
    }
    if (type === 'info') {
      icon = <InfoIcon size={18} />
      classColor = 'bg-info/10 border-info/20 dark:bg-info/20 dark:border-info/40'
    }
    assert(icon)
    assert(classColor)
    className = `${className} ${classColor}`
  }
  return (
    <blockquote className={className} style={style}>
      {icon && (
        <>
          <span style={{ fontFamily: 'emoji' }} className="mr-1 mt-0.5">
            {icon}
          </span>
        </>
      )}
      <div className="flex-1">{children}</div>
    </blockquote>
  )
}
