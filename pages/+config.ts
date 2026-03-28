import type { Config } from 'vike/types'
import vikeReact from 'vike-react/config'
import telefunc from '@/pages/+telefunc'

export default {
  meta: {
    telefunc: {
      env: {
        server: true,
        client: true,
      },
      global: true,
    },
  },
  title: 'telefunc',
  description: 'telefunc documentation',
  telefunc,
  htmlAttributes: { 'data-theme': 'telefunc-dark' },
  passToClient: ['locale', 'urlPathnameLocalized'],
  extends: [vikeReact],
  prerender: true,
} satisfies Config
