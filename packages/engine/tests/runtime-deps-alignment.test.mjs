import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const testsDir = path.dirname(fileURLToPath(import.meta.url))
const enginePackageJsonPath = path.resolve(testsDir, '..', 'package.json')
const consumerPackageJsonPath = path.resolve(testsDir, '..', '..', 'docs', 'package.json')

const readJson = (filePath) => {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

test('engine local runtime deps stay aligned with the first-party docs React and Vike stack', () => {
  const enginePackageJson = readJson(enginePackageJsonPath)
  const consumerPackageJson = readJson(consumerPackageJsonPath)

  const runtimePackages = [
    ['react', consumerPackageJson.dependencies?.react],
    ['react-dom', consumerPackageJson.dependencies?.['react-dom']],
    ['vike', consumerPackageJson.dependencies?.vike],
    ['vike-react', consumerPackageJson.dependencies?.['vike-react']],
    ['vite', consumerPackageJson.devDependencies?.vite],
  ]

  for (const [packageName, expectedVersion] of runtimePackages) {
    assert.equal(
      enginePackageJson.devDependencies?.[packageName],
      expectedVersion,
      `${packageName} should match between engine devDependencies and the consumer runtime manifest`,
    )
  }
})
