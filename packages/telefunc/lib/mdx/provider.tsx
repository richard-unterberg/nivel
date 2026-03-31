export { useMDXComponents }

import {
  Alert,
  ChoiceGroup,
  CodeBlockTransformer,
  FileAdded,
  FileRemoved,
  Link,
  Pre,
  RepoLink,
  Table,
} from '@unterberg/universal-mdx-mods'

type MdxComponents = Record<string, unknown>

const useMDXComponents = (components: MdxComponents = {}) => {
  return {
    Alert,
    Link,
    RepoLink,
    Table,
    pre: Pre,
    ChoiceGroup,
    FileAdded,
    FileRemoved,
    CodeBlockTransformer,
    ...components,
  }
}
