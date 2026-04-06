import { transformerNotationHighlight } from '@brillout/shiki-transformers'
import { transformerNotationDiff, transformerNotationWordHighlight } from '@shikijs/transformers'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkDirective from 'remark-directive'
import { rehypeMetaToProps } from './rehypeMetaToProps.js'
import { remarkChoiceGroup } from './remarkChoiceGroup.js'
import { remarkDetype } from './remarkDetype.js'
import { remarkPkgManager } from './remarkPkgManager.js'
import { shikiTransformerAutoLinks } from './shikiTransformerAutoLinks.js'

export { getCodeBlockPropsFromMeta, parseMetaString } from './meta.js'
export { rehypeMetaToProps } from './rehypeMetaToProps.js'
export { remarkChoiceGroup } from './remarkChoiceGroup.js'
export { remarkDetype } from './remarkDetype.js'
export { remarkPkgManager } from './remarkPkgManager.js'
export { shikiTransformerAutoLinks } from './shikiTransformerAutoLinks.js'

export const getCodeBlockMdxPlugins = (): {
  remarkPlugins: any[]
  rehypePlugins: any[]
} => {
  return {
    remarkPlugins: [remarkDirective, remarkDetype, remarkPkgManager, remarkChoiceGroup],
    rehypePlugins: [
      [
        rehypePrettyCode,
        {
          keepBackground: false,
          theme: {
            light: 'github-light',
            dark: 'one-dark-pro',
          },
          transformers: [
            transformerNotationDiff(),
            transformerNotationHighlight(),
            transformerNotationWordHighlight(),
            shikiTransformerAutoLinks(),
          ],
        },
      ],
      rehypeMetaToProps,
    ],
  }
}
