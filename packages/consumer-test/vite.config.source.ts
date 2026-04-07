import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import vike from 'vike/plugin'

process.env.VIKE_CRAWL ??= JSON.stringify({ git: false })

const engineRoot = path.resolve(import.meta.dirname, '../engine/src')
const base = (() => {
  const normalized = process.env.PAGES_BASE_PATH?.trim().replace(/^\/+|\/+$/g, '') ?? ''
  return normalized ? `/${normalized}/` : '/'
})()

export default {
  base,
  resolve: {
    alias: [
      {
        find: /^@unterberg\/nivel\/mdx\/code-blocks$/,
        replacement: path.join(engineRoot, 'mdx/code-blocks/index.ts'),
      },
      {
        find: /^@unterberg\/nivel\/runtime\/client$/,
        replacement: path.join(engineRoot, 'runtime/client/index.ts'),
      },
      {
        find: /^@unterberg\/nivel\/runtime\/node$/,
        replacement: path.join(engineRoot, 'runtime/node/index.ts'),
      },
      {
        find: /^@unterberg\/nivel\/client$/,
        replacement: path.join(engineRoot, 'runtime/client/index.ts'),
      },
      {
        find: /^@unterberg\/nivel\/mdx$/,
        replacement: path.join(engineRoot, 'mdx/index.ts'),
      },
      {
        find: /^@unterberg\/nivel\/vike$/,
        replacement: path.join(engineRoot, 'vike/index.ts'),
      },
      {
        find: /^@unterberg\/nivel$/,
        replacement: path.join(engineRoot, 'index.ts'),
      },
    ],
  },
  server: {
    fs: {
      allow: [path.resolve(import.meta.dirname, '..')],
    },
  },
  plugins: [tailwindcss(), vike()],
}
