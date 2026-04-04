import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptsDir = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(scriptsDir, '..')
const engineDir = path.join(rootDir, 'packages', 'engine')

const run = (command, args, options = {}) => {
  execFileSync(command, args, {
    cwd: rootDir,
    stdio: 'inherit',
    env: process.env,
    ...options,
  })
}

const readJson = (filePath) => {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

const sleep = (durationMs) => {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, durationMs)
}

const waitForPublishedVersion = (packageName, version) => {
  for (let attempt = 1; attempt <= 12; attempt += 1) {
    try {
      const resolvedVersion = execFileSync('npm', ['view', `${packageName}@${version}`, 'version'], {
        cwd: rootDir,
        stdio: ['ignore', 'pipe', 'pipe'],
        env: process.env,
        encoding: 'utf8',
      }).trim()

      if (resolvedVersion === version) {
        return
      }
    } catch {}

    if (attempt < 12) {
      sleep(5000)
    }
  }

  throw new Error(`Timed out waiting for ${packageName}@${version} to become available on npm.`)
}

const main = () => {
  const nivelPackageJson = readJson(path.join(engineDir, 'package.json'))

  run('pnpm', ['--filter', '@unterberg/nivel', 'build'])
  run('npm', ['publish', '--access', 'public'], { cwd: engineDir })
  waitForPublishedVersion(nivelPackageJson.name, nivelPackageJson.version)
  run('node', ['./scripts/buildConsumerTestProd.mjs'])
}

main()
