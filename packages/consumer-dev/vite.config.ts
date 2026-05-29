import { nivelTailwindVite } from '@unterberg/nivel/tailwind'

import vike from 'vike/plugin'
import { viteBeastiesOutputPlugin } from './lib/critical'

process.env.VIKE_CRAWL ??= JSON.stringify({ git: false })

const base = (() => {
  const normalized = process.env.PAGES_BASE_PATH?.trim().replace(/^\/+|\/+$/g, '') ?? ''
  return normalized ? `/${normalized}/` : '/'
})()

export default {
  base,
  plugins: [nivelTailwindVite(), vike(), viteBeastiesOutputPlugin()],
}
