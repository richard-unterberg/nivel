import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import mdx from '@mdx-js/rollup'
import { transformerNotationHighlight } from '@brillout/shiki-transformers'
import { transformerNotationDiff, transformerNotationWordHighlight } from '@shikijs/transformers'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkDirective from 'remark-directive'
import remarkGfm from 'remark-gfm'
import vike from 'vike/plugin'
import { defineConfig, type PluginOption } from 'vite'
import { rehypeMetaToProps } from './lib/docs/codeBlocks/rehypeMetaToProps'
import { remarkChoiceGroup } from './lib/docs/codeBlocks/remarkChoiceGroup'
import { remarkDetype } from './lib/docs/codeBlocks/remarkDetype'
import { remarkPkgManager } from './lib/docs/codeBlocks/remarkPkgManager'
import { shikiTransformerAutoLinks } from './lib/docs/codeBlocks/shikiTransformerAutoLinks'
import { rehypeDocHeadings } from './lib/docs/rehypeDocHeadings'
import { docsPagesPlugin } from './lib/docs/vitePlugin'
import { searchIndexPlugin } from './lib/search/vitePlugin'
import tsConf from './tsconfig.json'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Generated docs pages live in an untracked directory. Vike's default git-based
// crawler misses nested plus files in untracked directories, so force glob
// crawling to make generated routes visible in dev and build.
process.env.VIKE_CRAWL ??= JSON.stringify({ git: false })

const normalizeBaseUrl = (value: string | undefined) => {
  const normalized = value?.trim()

  if (!normalized || normalized === '/') {
    return '/'
  }

  return `/${normalized.replace(/^\/+|\/+$/g, '')}/`
}

const base = normalizeBaseUrl(process.env.PAGES_BASE_PATH)
const prettyCode: any = [
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
]

export const pathAliases = Object.entries(tsConf.compilerOptions.paths).map(([key, [value]]) => {
  if (key.includes('*')) {
    const find = new RegExp(`^${key.replace('/*', '/(.*)$')}`)
    const replacement = path.resolve(__dirname, value.replace('/*', '/$1'))
    return { find, replacement }
  }
  return { find: key, replacement: path.resolve(__dirname, value) }
})

export default defineConfig({
  base,
  plugins: [
    {
      ...mdx({
        providerImportSource: '@/lib/mdx/provider',
        remarkPlugins: [remarkGfm, remarkDirective, remarkDetype, remarkPkgManager, remarkChoiceGroup],
        rehypePlugins: [prettyCode, rehypeMetaToProps, rehypeDocHeadings],
      }),
      enforce: 'pre',
    },
    docsPagesPlugin(),
    react(),
    vike(),
    tailwindcss() as PluginOption,
    searchIndexPlugin(),
  ],
  resolve: {
    alias: [...pathAliases],
  },
  server: {
    port: 3001,
  },
  preview: {
    host: '127.0.0.1',
    port: 3002,
  },
})
