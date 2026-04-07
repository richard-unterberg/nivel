# nivel engine

docs builder proof of concept for generating vike-based documentation sites with a single docs graph as the source of truth.

monorepo structure:

- `packages/engine`: the reusable `@unterberg/nivel` package
- `packages/consumer-test`: the reference consumer used to exercise the engine against real docs content, currently based on the [Telefunc docs](https://telefunc.com)

## Alpha Status

This project is an early proof of concept and should be expected to have rough edges. The main goal is to validate the core engine ideas and architecture, not to provide a polished general-purpose doc builder right now. Some specific things to keep in mind:

- Expect breaking changes.
- The public API is not stable yet. (blackbox)
- The supported stack fixed currently to Vike + Vite + React.
- `basePath` is currently fixed to `/docs`.
- The consumer app in this repo is still the main integration example.

If you need a polished general-purpose docpress replacement today, this is not that yet.

## What It Does

The engine currently owns the core docs runtime:

- docs graph validation and resolution
- generated Vike routes from MDX content
- shared docs layout pieces such as navbar, sidebar, table of contents, pagination, and meta head wiring
- MDX setup with built-in docs components and code-block transforms
- asset handling for engine-owned fonts and shared static assets

The intended split is:

- the engine owns behavior, runtime wiring, and reusable UI primitives
- the consumer owns docs content, `docs/docs.graph.ts`, `pages/+docs.ts`, and brand/theme assets

## Minimal Shape

At the moment, a consumer looks roughly like this:

```ts
// pages/+docs.ts
import { defineDocsConfig } from '@unterberg/nivel'
import { docsGraph } from '../docs/docs.graph'

export default defineDocsConfig({
  siteTitle: 'My Docs',
  basePath: '/docs',
  graph: docsGraph,
  algolia: {
    appId: 'YOUR_APP_ID',
    apiKey: 'YOUR_SEARCH_ONLY_API_KEY',
    indexName: 'YOUR_INDEX_NAME',
  },
})
```

```ts
// docs/docs.graph.ts
import { defineDocsGraph } from '@unterberg/nivel'

export const docsGraph = defineDocsGraph({
  items: [
    {
      kind: 'section',
      id: 'docs',
      title: 'Documentation',
      items: [
        {
          kind: 'page',
          id: 'quickStart',
          title: 'Quick Start',
          slug: 'quick-start',
          source: 'content/quick-start/content.mdx',
        },
      ],
    },
  ],
})
```

Then the consumer wires:

- `@unterberg/nivel/vike` into Vike config
- `MetaHead` in global `+Head`
- `AppLayout` in global `+Layout`
- `nivel prepare` before dev/build/typecheck
- `@import '@unterberg/nivel/tailwind-sources.css'` in the consumer Tailwind entry

Algolia search is optional. When configured, `apiKey` must be a search-only public key because requests are made from the browser.

## Current Limitations

- The package is still alpha and should be expected to change.
- The supported stack is currently narrow: Vike + Vite + React.
- `basePath` is currently fixed to `/docs`.
- The package is still validated mainly through one real consumer, not a broad set of independent adopters.
- The setup and examples are still catching up with the implementation, so the integration story is not fully polished yet.

## Future Plans

- Continue hardening the engine/consumer split so docs behavior stays in `@unterberg/nivel` and the consumer remains thin.
- Improve the package-level docs and examples so setup is easier to understand without reading the consumer app in detail.
- Reduce hard-coded assumptions where it makes sense, starting with the areas that currently make the engine feel too tied to its first consumer.

## Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm typecheck
pnpm format
pnpm knip
```
