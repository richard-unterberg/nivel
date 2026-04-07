import path from 'node:path'
import { syncGeneratedDocsPages } from './runtime/node/codegen.js'
import { loadDocsConfigWithTsx } from './runtime/node/loadDocsConfigWithTsx.js'

const usage = [
  'Usage:',
  '  nivel prepare [--root <path>]',
  '',
  'Commands:',
  '  prepare    Generate docs pages from pages/+docs.ts',
].join('\n')

const parseCliArgs = (args: string[]) => {
  let command: string | null = null
  let rootDir = process.cwd()

  for (let index = 0; index < args.length; index += 1) {
    const value = args[index]

    if (value === '--help' || value === '-h') {
      return {
        command: 'help',
        rootDir,
      }
    }

    if (value === '--root') {
      const nextValue = args[index + 1]

      if (!nextValue) {
        throw new Error('Missing value for --root.')
      }

      rootDir = path.resolve(nextValue)
      index += 1
      continue
    }

    if (value.startsWith('--')) {
      throw new Error(`Unknown option ${value}`)
    }

    if (command) {
      throw new Error(`Unexpected argument ${value}`)
    }

    command = value
  }

  return {
    command,
    rootDir,
  }
}

const runPrepare = async (rootDir: string) => {
  const docsConfig = await loadDocsConfigWithTsx(rootDir)

  syncGeneratedDocsPages({
    rootDir,
    docsConfig,
  })
}

export const runCli = async (args: string[]) => {
  const parsed = parseCliArgs(args)

  if (!parsed.command || parsed.command === 'help') {
    process.stdout.write(`${usage}\n`)
    return
  }

  if (parsed.command !== 'prepare') {
    throw new Error(`Unknown command ${parsed.command}`)
  }

  await runPrepare(parsed.rootDir)
}

void runCli(process.argv.slice(2)).catch((error: unknown) => {
  const message = error instanceof Error ? (error.stack ?? error.message) : String(error)
  process.stderr.write(`${message}\n`)
  process.exitCode = 1
})
