import tailwindcss from '@tailwindcss/vite'
import vike from 'vike/plugin'

process.env.VIKE_CRAWL ??= JSON.stringify({ git: false })

const base = (() => {
  const normalized = process.env.PAGES_BASE_PATH?.trim().replace(/^\/+|\/+$/g, '') ?? ''
  return normalized ? `/${normalized}/` : '/'
})()

export default {
  base,
  plugins: [tailwindcss(), vike()],
}
