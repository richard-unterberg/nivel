import { transformerNotationHighlight } from '@brillout/shiki-transformers'
import { transformerNotationDiff, transformerNotationWordHighlight } from '@shikijs/transformers'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkDirective from 'remark-directive'
import { stripMetaProps } from './meta.js'
import { rehypeMetaToProps } from './rehypeMetaToProps.js'
import { remarkChoiceGroup } from './remarkChoiceGroup.js'
import { remarkDetype } from './remarkDetype.js'
import { remarkPkgManager } from './remarkPkgManager.js'
import { remarkRestoreUnsupportedDirectives } from './remarkRestoreUnsupportedDirectives.js'
import { shikiTransformerAutoLinks } from './shikiTransformerAutoLinks.js'

export { getCodeBlockPropsFromMeta, parseMetaString, stripMetaProps } from './meta.js'
export { rehypeMetaToProps } from './rehypeMetaToProps.js'
export { remarkChoiceGroup } from './remarkChoiceGroup.js'
export { remarkDetype } from './remarkDetype.js'
export { remarkPkgManager } from './remarkPkgManager.js'
export { remarkRestoreUnsupportedDirectives } from './remarkRestoreUnsupportedDirectives.js'
export { shikiTransformerAutoLinks } from './shikiTransformerAutoLinks.js'

const REHYPE_PRETTY_CODE_INTERNAL_META_PROPS = [
  'data-language-label',
  'env',
  'file-added',
  'file-removed',
  'hide-menu',
  'render',
  'title',
] as const

export const getCodeBlockMdxPlugins = () => {
  const rehypePrettyCodePlugin = [
    rehypePrettyCode,
    {
      keepBackground: false,
      filterMetaString: (meta: string) => stripMetaProps(meta, [...REHYPE_PRETTY_CODE_INTERNAL_META_PROPS]),
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
  ] as [typeof rehypePrettyCode, Parameters<typeof rehypePrettyCode>[0]]

  return {
    remarkPlugins: [
      remarkDirective,
      remarkRestoreUnsupportedDirectives,
      remarkDetype,
      remarkPkgManager,
      remarkChoiceGroup,
    ],
    rehypePlugins: [rehypePrettyCodePlugin, rehypeMetaToProps],
  }
}
