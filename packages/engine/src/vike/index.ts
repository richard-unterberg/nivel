export { nivelConfig as default }

import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'
import type { Config } from 'vike/types'
import type { PluginOption, UserConfig } from 'vite'
import { getCodeBlockMdxPlugins } from '../mdx/code-blocks/index.js'
import { rehypeDocsHeadings } from '../mdx/plugins/rehypeDocsHeadings.js'
import { nivelPagesPlugin } from '../runtime/node/index.js'

process.env.VIKE_CRAWL ??= JSON.stringify({ git: false })

const codeBlockMdxPlugins = getCodeBlockMdxPlugins()

const viteConfig: UserConfig = {
  plugins: [
    {
      ...mdx({
        providerImportSource: '@unterberg/nivel/mdx',
        ...codeBlockMdxPlugins,
        rehypePlugins: [...codeBlockMdxPlugins.rehypePlugins, rehypeDocsHeadings],
        remarkPlugins: [remarkGfm, ...codeBlockMdxPlugins.remarkPlugins],
      }),
      enforce: 'pre',
    } as PluginOption,
    nivelPagesPlugin(),
  ],
  ssr: {
    noExternal: ['@unterberg/nivel'],
  },
}

const nivelConfig = {
  meta: {
    docs: {
      env: {
        server: true,
        client: true,
      },
      global: true,
    },
  },
  prerender: true,
  trailingSlash: true,
  vite: viteConfig as Record<string, unknown>,
} satisfies Config
