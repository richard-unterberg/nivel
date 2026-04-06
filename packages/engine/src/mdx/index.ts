import type { ComponentType } from 'react'
import {
  Alert,
  ChoiceGroup,
  CodeBlockTransformer,
  FileAdded,
  FileRemoved,
  Link,
  Overview,
  Pre,
  RepoLink,
  Table,
} from '../index.js'

type MdxComponents = Record<string, ComponentType<any> | string>

export const useMDXComponents = (components?: MdxComponents): MdxComponents => {
  return {
    Alert,
    Link,
    RepoLink,
    Table,
    Overview,
    ChoiceGroup,
    CodeBlockTransformer,
    FileAdded,
    FileRemoved,
    pre: Pre,
    ...components,
  }
}
