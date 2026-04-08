# nivel engine

`@unterberg/nivel` is the docs runtime for this repo's Vike-based documentation sites.

It currently owns:

- docs graph validation and resolution
- generated Vike routes from MDX content
- docs layout primitives such as navbar, sidebar, table of contents, pagination, and meta head wiring
- MDX setup with built-in docs components and code-block transforms
- optional Algolia search wiring
- engine-owned fonts and shared assets

The supported stack is currently Vike + Vite + React. Expect breaking changes while the package is still alpha.

## Public Helpers

```ts
import { defineDocsConfig, defineDocsGraph } from '@unterberg/nivel/config'
```

Both helpers are identity functions. They are also re-exported from `@unterberg/nivel`, but the dedicated config entry keeps `pages/+docs.ts` and `docs/docs.graph.ts` on a lean config-time import path.

```ts
const docsGraph = defineDocsGraph({
  items: [
    {
      kind: 'section',
      id: 'docs',
      title: 'Docs',
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

export default defineDocsConfig({
  siteTitle: 'My Docs',
  siteDescription: 'Documentation site powered by @unterberg/nivel.',
  basePath: '/docs',
  // Optional project-relative root for page.source resolution.
  // contentDir: 'docs',
  graph: docsGraph,
})
```

## Recommended Consumer Files

A consumer should keep these files explicit and local:

- hand-authored: `pages/+docs.ts`, `docs/docs.graph.ts`, docs content, brand assets, and consumer CSS/Tailwind/theme files
- scaffolded once but still editable: `pages/+config.ts`, `pages/+Head.tsx`, `pages/+Layout.tsx`, `pages/+onCreateGlobalContext.ts`, `pages/+Wrapper.tsx`, and `global.d.ts`

Only `(nivel-generated)` stays engine-generated.

## Standard Vike Config

Keep `pages/+config.ts` looking like normal Vike config and spread in the engine-owned config from `@unterberg/nivel/vike`:

```ts
// pages/+docs.ts
import { defineDocsConfig } from '@unterberg/nivel/config'
import { docsGraph } from '../docs/docs.graph'

export default defineDocsConfig({
  siteTitle: 'My Docs',
  siteDescription: 'Documentation site powered by @unterberg/nivel.',
  basePath: '/docs',
  graph: docsGraph,
})
```

`basePath` controls the public docs route prefix. `contentDir` is an optional project-relative filesystem root for resolving `page.source` entries and defaults to `docs`.

```ts
// pages/+config.ts
import nivel from '@unterberg/nivel/vike'
import type { Config } from 'vike/types'
import vikeReact from 'vike-react/config'
import docsConfig from './+docs'

export { config }

const themePreference = docsConfig.theme?.defaultPreference ?? 'light'
const dataTheme =
  themePreference === 'dark'
    ? (docsConfig.theme?.dark ?? 'consumer-dark')
    : (docsConfig.theme?.light ?? 'consumer-light')

const config: Config = {
  ...nivel,
  extends: [vikeReact],
  title: docsConfig.siteTitle,
  description: docsConfig.siteDescription ?? `${docsConfig.siteTitle} documentation`,
  htmlAttributes: { 'data-theme': dataTheme },
  passToClient: ['docs'],

  // User-facing Vike levers stay visible here.
  prerender: true,
  // ssr: true,
  // prefetchStaticAssets: 'viewport',
}
```

The engine still owns the MDX, Vite, route-generation, and runtime wiring. The consumer keeps the normal Vike entry file and can adjust visible levers such as `prerender`, `ssr`, and prefetch-related settings directly in `+config.ts`.

## CLI

`nivel prepare` generates docs pages from `pages/+docs.ts`.

`nivel init` scaffolds the visible consumer shell files and updates the standard docs scripts in `package.json`.

```bash
nivel init
nivel prepare
```

`nivel init` does not create or overwrite consumer CSS/Tailwind/theme files. Keep those hand-authored. Add the engine Tailwind helper manually in your stylesheet:

```css
@import '@unterberg/nivel/tailwind-sources.css';
```

If you use Algolia, `apiKey` must be a search-only public key because requests are made from the browser.

## Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm typecheck
pnpm format
pnpm knip
```
