import type { ValidComponent } from 'solid-js'
import { Dynamic } from 'solid-js/web'

export const Fragment = (props: { children?: unknown }) => {
  return props.children
}

export const jsx = (type: unknown, props: Record<string, unknown> = {}) => {
  return <Dynamic component={type as ValidComponent} {...props} />
}

export const jsxs = jsx
export const jsxDEV = jsx
