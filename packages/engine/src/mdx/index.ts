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
import { MdxTable } from './components/Table.js'

type MdxComponents = Record<string, unknown>

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
    table: MdxTable,
    ...components,
  }
}
