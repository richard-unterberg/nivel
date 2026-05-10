export { nivelConfig as default }

import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'
import type { Config } from 'vike/types'
import type { PluginOption, UserConfig } from 'vite'
import type { DocsConfig } from '../docs/types.js'
import { getCodeBlockMdxPlugins } from '../mdx/code-blocks/index.js'
import { rehypeDefinitionLists } from '../mdx/plugins/rehypeDefinitionLists.js'
import { rehypeDocsHeadings } from '../mdx/plugins/rehypeDocsHeadings.js'
import { nivelPagesPlugin } from '../runtime/node/index.js'
import { createNivelSitemapPlugins } from './sitemap.js'

process.env.VIKE_CRAWL ??= JSON.stringify({ git: false })

const codeBlockMdxPlugins = getCodeBlockMdxPlugins()

const viteConfig: UserConfig = {
  plugins: [
    {
      ...mdx({
        providerImportSource: '@unterberg/nivel/mdx',
        ...codeBlockMdxPlugins,
        rehypePlugins: [...codeBlockMdxPlugins.rehypePlugins, rehypeDefinitionLists, rehypeDocsHeadings],
        remarkPlugins: [remarkGfm, ...codeBlockMdxPlugins.remarkPlugins],
      }),
      enforce: 'pre',
    } as PluginOption,
    nivelPagesPlugin(),
  ],
  resolve: {
    dedupe: ['react', 'react-dom', 'vike', 'vike-react'],
  },
  ssr: {
    noExternal: ['@unterberg/nivel'],
  },
}

const getConsumerViteConfig = (docsConfig: DocsConfig) => {
  return {
    ...viteConfig,
    plugins: [...(viteConfig.plugins ?? []), ...createNivelSitemapPlugins(docsConfig)],
  } satisfies UserConfig
}

const getDefaultConsumerDataTheme = (docsConfig: DocsConfig) => {
  const defaultPreference = docsConfig.theme?.defaultPreference ?? 'light'
  const lightThemeName = docsConfig.theme?.light ?? 'consumer-light'
  const darkThemeName = docsConfig.theme?.dark ?? 'consumer-dark'

  return defaultPreference === 'dark' ? darkThemeName : lightThemeName
}

const vikeReactConfigImport = 'import:vike-react/config:default'

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

export const createNivelVikeConfig = (docsConfig: DocsConfig) => {
  return {
    ...nivelConfig,
    title: docsConfig.siteTitle,
    description: docsConfig.siteDescription ?? `${docsConfig.siteTitle} documentation`,
    extends: [vikeReactConfigImport] as unknown as Config['extends'],
    htmlAttributes: {
      'data-theme': getDefaultConsumerDataTheme(docsConfig),
    },
    prerender: true,
    vite: getConsumerViteConfig(docsConfig) as Record<string, unknown>,
  } as Config
}
