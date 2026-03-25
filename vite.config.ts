import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import mdx from '@mdx-js/rollup'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import { defineConfig, type PluginOption } from 'vite'
import { rehypeDocHeadings } from './lib/docs/rehypeDocHeadings'
import tsConf from './lib/tsconf'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const pathAliases = Object.entries(tsConf.compilerOptions.paths).map(([key, [value]]) => {
  if (key.includes('*')) {
    const find = new RegExp(`^${key.replace('/*', '/(.*)$')}`)
    const replacement = path.resolve(__dirname, value.replace('/*', '/$1'))
    return { find, replacement }
  }
  return { find: key, replacement: path.resolve(__dirname, value) }
})

const plugins: PluginOption[] = [
  {
    ...mdx({
      jsxImportSource: '@/lib/mdx',
      rehypePlugins: [rehypeDocHeadings],
    }),
    enforce: 'pre',
  },
  react(),
  vike(),
  tailwindcss() as PluginOption,
]

export default defineConfig({
  plugins,
  resolve: {
    alias: [...pathAliases],
  },
  // build: {
  //   cssCodeSplit: false,
  // },
  server: {
    port: 5555,
  },
  preview: {
    port: 5556,
  },
})
