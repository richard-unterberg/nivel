import { syncGeneratedDocsPages } from '@unterberg/nivel/runtime/node'
import docsConfig from '../pages/+docs'

syncGeneratedDocsPages({
  rootDir: process.cwd(),
  docsConfig,
})
