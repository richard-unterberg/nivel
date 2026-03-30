export { useMDXComponents }

import { ChoiceGroup } from '@/components/docs/code-blocks/ChoiceGroup'
import { CodeBlockTransformer } from '@/components/docs/code-blocks/CodeBlockTransformer'
import { FileAdded, FileRemoved } from '@/components/docs/code-blocks/FileState'
import { Pre } from '@/components/docs/code-blocks/Pre'

type MdxComponents = Record<string, unknown>

const useMDXComponents = (components: MdxComponents = {}) => {
  return {
    pre: Pre,
    ChoiceGroup,
    FileAdded,
    FileRemoved,
    CodeBlockTransformer,
    ...components,
  }
}
