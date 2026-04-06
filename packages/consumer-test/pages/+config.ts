import nivel from '@unterberg/nivel/config'
import type { Config } from 'vike/types'
import vikeReact from 'vike-react/config'
import docs from './+docs'

export { config }

const themePreference = docs.theme?.defaultPreference ?? 'light'
const dataTheme =
  themePreference === 'dark' ? (docs.theme?.dark ?? 'consumer-dark') : (docs.theme?.light ?? 'consumer-light')

const config: Config = {
  ...nivel,
  title: docs.siteTitle,
  description: docs.siteDescription ?? `${docs.siteTitle} documentation`,
  extends: [vikeReact],
  htmlAttributes: { 'data-theme': dataTheme },
  passToClient: ['docs'],
  prerender: true,
}
