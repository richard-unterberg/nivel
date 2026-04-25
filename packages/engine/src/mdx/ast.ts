import type { MdxJsxFlowElement } from 'mdast-util-mdx-jsx'

export type ChoiceData = {
  customDataChoice?: string | undefined
  customDataFilter?: string | undefined
}

export interface AstNode {
  type: string
  data?: ChoiceData | undefined
}

export interface ParentNode<Child extends AstNode = AstNode> extends AstNode {
  children: Child[]
}

export interface RootNode extends ParentNode {
  type: 'root'
}

export interface CodeNode extends AstNode {
  type: 'code'
  value: string
  lang?: string | null | undefined
  meta?: string | null | undefined
}

type DirectiveAttributes = Record<string, string | null | undefined>

export type ChoiceGroupElement = Omit<MdxJsxFlowElement, 'data'> &
  AstNode & {
    data?: ChoiceData | undefined
  }

export type ChoiceCarrierNode = CodeNode | ContainerDirective | ChoiceGroupElement

export interface ContainerDirective extends ParentNode<ChoiceCarrierNode> {
  type: 'containerDirective'
  name: string
  attributes?: DirectiveAttributes | null | undefined
}

export interface FileLike {
  path?: string | undefined
  value?: unknown
}

export interface TextNode extends AstNode {
  type: 'text'
  value: string
}

export interface ParagraphNode extends ParentNode<TextNode> {
  type: 'paragraph'
}

export interface PositionLike {
  start?: {
    offset?: number | undefined
  }
  end?: {
    offset?: number | undefined
  }
}

export interface UnsupportedDirectiveNode extends AstNode {
  type: 'leafDirective' | 'textDirective'
  position?: PositionLike | undefined
}

export type ElementContentNode = ElementNode | TextNode

export interface ElementNode extends ParentNode<ElementContentNode> {
  type: 'element'
  tagName: string
  properties: Record<string, unknown>
}

export interface HtmlRootNode extends ParentNode<ElementContentNode> {
  type: 'root'
}

export const isContainerDirective = (node: ChoiceCarrierNode): node is ContainerDirective => {
  return node.type === 'containerDirective'
}

export const hasChildren = (node: unknown): node is ParentNode => {
  return typeof node === 'object' && node !== null && Array.isArray((node as Partial<ParentNode>).children)
}
