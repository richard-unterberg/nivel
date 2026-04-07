import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { nivelPublicRoute } from '@unterberg/nivel'

const getNivelRoot = () => {
  const nivelConfigUrl = import.meta.resolve('@unterberg/nivel/vike')
  const nivelConfigPath = fileURLToPath(nivelConfigUrl)
  return path.resolve(path.dirname(nivelConfigPath), '..')
}

const syncNivelAssets = () => {
  const consumerRoot = process.cwd()
  const nivelAssetsRoot = path.join(getNivelRoot(), 'assets', nivelPublicRoute.replace(/^\/+/, ''))
  const outputRoot = path.join(consumerRoot, 'dist', 'client', nivelPublicRoute.replace(/^\/+/, ''))

  if (!fs.existsSync(nivelAssetsRoot)) {
    throw new Error(`Missing nivel assets directory: ${nivelAssetsRoot}`)
  }

  fs.rmSync(outputRoot, { recursive: true, force: true })
  fs.mkdirSync(path.dirname(outputRoot), { recursive: true })
  fs.cpSync(nivelAssetsRoot, outputRoot, { recursive: true })
}

syncNivelAssets()
