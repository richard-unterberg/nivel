import { createNivelVikeConfig } from '@unterberg/nivel/vike'
import docsConfig from './+docs'

const config = {
  ...createNivelVikeConfig(docsConfig),
  prerender: true,
}

export default config
