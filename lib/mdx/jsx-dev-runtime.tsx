import { Fragment, jsxDEV as reactJsxDEV } from 'react/jsx-dev-runtime'
import { jsx as reactJsx, jsxs as reactJsxs } from 'react/jsx-runtime'
import { MdxLink } from './MdxLink'

type MdxElementType = Parameters<typeof reactJsx>[0]

const resolveMdxType = (type: MdxElementType): MdxElementType => {
  return type === 'a' ? MdxLink : type
}

export { Fragment }

export const jsx: typeof reactJsx = (type, props, key) => reactJsx(resolveMdxType(type), props, key)
export const jsxs: typeof reactJsxs = (type, props, key) => reactJsxs(resolveMdxType(type), props, key)
export const jsxDEV: typeof reactJsxDEV = (type, props, key, isStaticChildren, source, self) =>
  reactJsxDEV(resolveMdxType(type), props, key, isStaticChildren, source, self)
