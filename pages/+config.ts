import type { Config } from 'vike/types'
import vikeReact from 'vike-react/config'
import mdex from '@/pages/+mdex'

// Default config (can be overridden by pages)
// https://vike.dev/config

export default {
  meta: {
    mdex: {
      env: {
        server: true,
        client: true,
      },
      global: true,
    },
  },
  // https://vike.dev/head-tags
  title: 'mdex',
  description: 'mdex docs starter kit',
  mdex,
  htmlAttributes: { 'data-theme': 'vike-dark' },
  passToClient: ['locale', 'urlPathnameLocalized'],
  extends: [vikeReact],
  prerender: true,
} satisfies Config
