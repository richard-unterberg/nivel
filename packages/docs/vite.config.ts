import { nivelTailwindVite } from '@unterberg/nivel/tailwind'
import { viteBeastiesOutputPlugin } from '@unterberg/vite-beasties-output'

import vike from 'vike/plugin'

process.env.VIKE_CRAWL ??= JSON.stringify({ git: false })

const base = (() => {
  const normalized = process.env.PAGES_BASE_PATH?.trim().replace(/^\/+|\/+$/g, '') ?? ''
  return normalized ? `/${normalized}/` : '/'
})()

export default {
  base,
  plugins: [
    nivelTailwindVite(),
    vike(),
    viteBeastiesOutputPlugin({
      outputDirectory: 'dist/client',
      beastiesOptions: {
        allowRules: [
          /data-theme=.*dark/,
          /data-theme=.*light/,
          /^:root:has\(input\.theme-controller/,
          /^:where\(:root\)$/,
        ],
      },
    }),
  ],
}
