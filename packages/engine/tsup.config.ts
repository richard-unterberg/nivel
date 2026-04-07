import { defineConfig } from 'tsup'

export default defineConfig((overrideOptions) => ({
  entry: {
    cli: 'src/cli.ts',
    index: 'src/index.ts',
    vike: 'src/vike/index.ts',
    mdx: 'src/mdx/index.ts',
    'mdx/code-blocks': 'src/mdx/code-blocks/index.ts',
    client: 'src/runtime/client/index.ts',
    'runtime/client': 'src/runtime/client/index.ts',
    'runtime/node': 'src/runtime/node/index.ts',
  },
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: !overrideOptions.watch,
  external: ['react', 'react-dom', 'vike', 'vike-react', 'vite'],
}))
