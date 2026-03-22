import type { Config } from 'vike/types'
import vikeReact from 'vike-react/config'

// Default config (can be overridden by pages)
// https://vike.dev/config

export default {
  // https://vike.dev/head-tags
  title: 'Vike',
  description: 'Docs re-amp',
  htmlAttributes: { 'data-theme': 'vike-dark' },
  passToClient: ['locale', 'urlPathnameLocalized', 'themePreference'],
  extends: [vikeReact],
} satisfies Config
