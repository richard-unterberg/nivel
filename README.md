# mdex

`mdex` is a docs starter built as a real Vike application, not as a standalone docs theme.

The goal of this template is to give you a fully fledged SSR React app with a documentation runtime already integrated. You can ship docs, landing pages, custom product pages, and app-specific UI in the same codebase without fighting a docs-first framework that expects the whole project to behave like a docs site.

## What This Template Is

- A Vike + React SSR app with an MDX-powered docs runtime.
- A starter for teams that want docs inside a real application shell.
- A base for custom docs experiences, product sites, or hybrid marketing/docs apps.
- A repo with built-in theming, localization, sidebar navigation, and table of contents support.

## What This Template Is Not

- Not a generic static docs theme trying to replace Docusaurus, Starlight, or VitePress feature-for-feature.
- Not a batteries-included docs platform with versioning, search, analytics, and GitHub integrations already wired.
- Not a file-tree-driven docs generator where every docs folder is also a native Vike page subtree.

If your main goal is "spin up a conventional docs portal with the biggest plugin ecosystem", there are more mature options. If your goal is "build a real SSR app that happens to have a strong docs runtime", this template is aimed at that use case.

![screenshot 1](https://github.com/richard-unterberg/vike-docpress/blob/master/public/preview/preview-1.jpg?raw=true)

## Current Features

- SSR and prerendering through Vike
- MDX docs pages discovered from `pages/**/content.*.mdx`
- Global docs system config in `pages/+mdex.ts`
- Per-document inherited config through `content.config.ts` / `content.config.js`
- Locale-aware routing with `en` and `zh`
- Light/dark theme support with pre-hydration theme bootstrapping
- Built-in localized search with build-time index generation and lazy client loading
- Landing page plus docs layout in one app
- Sidebar navigation, docs footer, and right-side table of contents

## Stack

- [Vike](https://vike.dev/) + [`vike-react`](https://vike.dev/react) for routing, SSR, prerendering, and app architecture
- [React 19](https://react.dev/)
- [Vite 7](https://vite.dev/)
- [MDX](https://mdxjs.com/) via `@mdx-js/rollup`
- [Tailwind CSS 4](https://tailwindcss.com/)
- [DaisyUI 5](https://daisyui.com/)
- [Zustand](https://zustand.docs.pmnd.rs/) for persisted user settings
- [`@classmatejs/react`](https://www.npmjs.com/package/@classmatejs/react) for component class composition

## Current Non-Goals / Missing Pieces

- Edit-on-GitHub and report-issue links are placeholders
- Navigation is currently manual
- Docs versioning is not implemented
- Search ranking is intentionally simple and the current search index only includes the first `n` parsed words per doc
- This repo currently uses a custom docs content runtime instead of native per-doc Vike page config

Those constraints are deliberate for now. The template favors application control and a simple internal model over trying to imitate the entire feature set of established docs platforms.

## Project Shape

```text
pages/
  +config.ts                # global Vike config
  +mdex.ts                  # global docs runtime config
  index/+Page.tsx           # landing page
  (docs)/(config)/*         # single dynamic docs page subtree
  (docs)/(content)/**       # MDX content modules and content.config.ts files

lib/docs/
  content.tsx               # docs discovery and runtime loading
  systemConfig.ts           # docs URL and config resolution
  headings.ts               # heading extraction

lib/search/
  buildIndex.ts             # build-time search index generation from raw MDX
  vitePlugin.ts             # dev/build asset wiring for search indexes
  index.ts                  # client-side loading and scoring

components/
  Navbar/
  Sidebar/
  TableOfContents.tsx
  Footer.tsx
  css/
```

## Docs Runtime Model

This repo does not render each document as its own Vike page subtree.

Instead:

- MDX files under `pages/(docs)/(content)/**` are treated as content modules.
- The rendered docs page lives in the single dynamic Vike subtree at `pages/(docs)/(config)`.
- Shared per-document options live in `content.config.ts` / `content.config.js`.
- Global docs behavior lives in `pages/+mdex.ts`.

This is the main tradeoff in the current architecture: you get a straightforward, app-centric docs runtime, but you do not get native Vike `+config.ts` inheritance next to each MDX file.

## Configuration

### Global docs settings

Use `pages/+mdex.ts` for app-wide docs behavior:

```ts
import type { MdexSystemConfig } from '../lib/docs/systemConfig'

export default {
  basePath: '',
  defaultSlug: 'get-started',
  defaultDocConfig: {
    tableOfContents: true,
  },
  search: {
    indexedWordsPerDoc: 120,
  },
} satisfies MdexSystemConfig
```

With `basePath: ''`, docs currently resolve at root-level paths such as `/get-started` instead of `/docs/get-started`.

`search.indexedWordsPerDoc` controls how many parsed words from each doc are included in the generated search index.

### Per-document shared settings

Use `content.config.ts` or `content.config.js` to define options shared by all translations of a doc route:

```ts
import type { DocConfig } from '@/lib/docs/config'

export default {
  tableOfContents: false,
} satisfies DocConfig
```

These config files inherit by logical doc path, so higher-level configs can apply defaults to nested docs.

## Search

Search indexes are generated from raw MDX content, not from rendered HTML.

- In dev, the Vite plugin serves locale-specific JSON at `/@search-index/<locale>.json`.
- In production builds, the same plugin emits `dist/client/assets/search-index.en.json` and `dist/client/assets/search-index.zh.json`.
- The plugin also patches `dist/assets.json` so deployments that rely on the asset manifest can discover those files.
- The navbar search loads the active locale index on demand and ranks matches on the client using title, slug, headings, and truncated body text.

## Getting Started

```bash
npm install
npm run dev
```

Available scripts:

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run typecheck`
- `npm run lint`
- `npm run format`

## Who This Template Is For

- Teams already choosing Vike for SSR and routing
- Projects that need docs and app pages in the same repo
- Developers who want to own the docs runtime instead of adopting a more prescriptive docs framework
- People comfortable extending a starter that is intentionally opinionated and still evolving

## Who Should Probably Use Something Else

- Teams that want advanced search, docs versioning, and a mature docs plugin ecosystem on day one
- Projects that are primarily a documentation site and only a documentation site
- Developers who want docs navigation and structure generated entirely from filesystem conventions

## Status

This starter is intentionally early and opinionated. It is closer to "good foundation for a custom docs app" than "finished universal docs product".

That is the point of the repo.
