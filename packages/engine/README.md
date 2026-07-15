# @unterberg/nivel

Deterministic structure engine for documentation systems

`@unterberg/nivel` owns the docs runtime: Vike integration, MDX setup, docs-graph validation, route code generation, page shell rendering, and reusable docs UI primitives. The consumer stays thin and keeps its content, docs graph, visible Vike shell files, and theme files local.

## What It Provides

- typed docs config and docs graph surfaces
- generated Vike docs pages from a single docs graph
- docs shell primitives such as navbar, sidebar, table of contents, pagination, search, and meta head wiring
- MDX support with built-in docs components and code-block tooling
- Tailwind v4 and daisyUI integration helpers
- a small CLI for consumer scaffolding and docs page generation

## Install

```bash
pnpm add @unterberg/nivel react react-dom vike vike-react
pnpm add -D vite typescript @types/react @types/react-dom
```

`vike` and `vite` are peer dependencies. The package exposes a local `nivel` binary after install.

Set `siteUrl` in `pages/+docs.ts` to enable automatic `sitemap.xml` and `robots.txt` generation. Set `robots: false` to emit `noindex, nofollow` and a disallow-all `robots.txt`. V1 includes canonical docs routes from the docs graph plus normal filesystem-routed consumer pages. Consumer routes remapped only through custom `+route.ts` files are not included automatically.

## Quick Start

Scaffold a consumer:

```bash
pnpm exec nivel init
```

Generate docs pages:

```bash
pnpm exec nivel prepare
```

Typical consumer scripts:

```json
{
  "scripts": {
    "generate:docs": "nivel prepare",
    "predev": "pnpm generate:docs",
    "dev": "vike dev",
    "prebuild": "pnpm generate:docs",
    "build": "vike build",
    "pretypecheck": "pnpm generate:docs",
    "typecheck": "tsc --noEmit -p tsconfig.json"
  }
}
```

## Consumer Shape

Keep these files local and visible in the consumer:

- `docs/docs.graph.ts`
- `pages/+docs.ts`
- `pages/+config.ts`
- `pages/+Head.tsx`
- `pages/+Layout.tsx`
- `pages/+onCreateGlobalContext.ts`
- `pages/+Wrapper.tsx`
- `global.d.ts`
- docs content, brand assets, and consumer CSS/theme files

Only `pages/(nivel-generated)` is engine-generated and should not be edited by hand.

`docs/docs.graph.ts` is the single source of truth for docs structure. Navbar and sidebar behavior come from that graph.

## Minimal Setup

`docs/docs.graph.ts`

```ts
import type { DocsGraph } from '@unterberg/nivel'

export const docsGraph = {
  items: [
    {
      kind: 'section',
      id: 'docs',
      title: 'Docs',
      items: [
        {
          kind: 'page',
          id: 'gettingStarted',
          title: 'Getting Started',
          slug: 'getting-started',
          source: 'content/getting-started/content.mdx',
          description: 'Getting started with @unterberg/nivel.',
        },
      ],
    },
  ],
} satisfies DocsGraph
```

`pages/+docs.ts`

```ts
import type { DocsConfig } from '@unterberg/nivel'
import { docsGraph } from '../docs/docs.graph'

const docsConfig = {
  graph: docsGraph,
  siteTitle: 'My Docs',
  siteDescription: 'Documentation site powered by @unterberg/nivel.',
  siteUrl: 'https://docs.example.com',
  // robots: false,
  // customFonts: false,
  basePath: '/docs',
} satisfies DocsConfig

export default docsConfig
```

`pages/+config.ts`

```ts
import { createNivelVikeConfig } from '@unterberg/nivel/vike'
import type { Config } from 'vike/types'
import docsConfig from './+docs'

export { config }

const config: Config = {
  ...createNivelVikeConfig(docsConfig),
  prerender: true,
}
```

`vite.config.mts`

```ts
import { nivelTailwindVite } from '@unterberg/nivel/tailwind'
import vike from 'vike/plugin'

process.env.VIKE_CRAWL ??= JSON.stringify({ git: false })

export default {
  plugins: [nivelTailwindVite(), vike()],
}
```

`pages/+Head.tsx`

```tsx
import { MetaHead } from '@unterberg/nivel/client'

export const Head = () => {
  return <MetaHead />
}
```

`pages/+Layout.tsx`

```tsx
import { AppLayout } from '@unterberg/nivel/client'
import type { ReactNode } from 'react'

const Layout = ({ children }: { children: ReactNode }) => {
  return <AppLayout>{children}</AppLayout>
}

export default Layout
```

`pages/+Wrapper.tsx`

```tsx
import type { ReactNode } from 'react'
import '../styles/global.css'

const Wrapper = ({ children }: { children: ReactNode }) => {
  return <>{children}</>
}

export default Wrapper
```

`styles/global.css`

```css
@import '@unterberg/nivel/tailwind.css';
@import './theme.css';

@source '../pages';
@source '../docs';
```

## CLI

```bash
nivel init [--root <path>] [--force]
nivel prepare [--root <path>]
nivel --help
```

- `nivel init` scaffolds the visible consumer files and patches the standard docs scripts in `package.json`
- `nivel init --force` overwrites scaffold-managed files if they already exist
- `nivel prepare` reads `pages/+docs.ts` and generates `pages/(nivel-generated)`

`nivel init` does not create or overwrite your brand assets or consumer-specific styling decisions beyond the initial scaffold. Theme and palette files stay consumer-owned.

## Public Entry Points

| Entry | Purpose |
| --- | --- |
| `@unterberg/nivel` | main types, MDX components, shared utilities |
| `@unterberg/nivel/vike` | engine-owned Vike config for the consumer's `pages/+config.ts` |
| `@unterberg/nivel/client` | `AppLayout`, `MetaHead`, `UserSettingsSync`, `DocsPage`, and client stores |
| `@unterberg/nivel/mdx` | MDX provider entry |
| `@unterberg/nivel/mdx/code-blocks` | code-block components and transforms |
| `@unterberg/nivel/tailwind` | `nivelTailwindVite()` helper |
| `@unterberg/nivel/daisyui-theme` | daisyUI theme plugin surface |
| `@unterberg/nivel/runtime/node` | lower-level runtime helpers for loading config, resolving docs, scaffolding, and codegen |
| `@unterberg/nivel/runtime/client` | lower-level client runtime entry |

## Notes

- `basePath` controls the public docs route prefix.
- `contentDir` is optional and defaults to `docs`.
- `social.editLinkPathPrefix` optionally prepends a repository-relative directory to GitHub edit links when the consumer root is nested inside the repository.
- `customFonts` is optional and defaults to `true`; set it to `false` in `pages/+docs.ts` to stop Nivel from injecting Inter so you can own fonts in consumer CSS.
- If you configure Algolia, `apiKey` must be a browser-safe search key.
- The repo validates this package through both the first-party docs app at `packages/docs` and the standalone fixture at `tests/npm-consumer`.
