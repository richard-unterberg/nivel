# Docs Architecture Note

- Monorepo baseline: this repo now uses pnpm workspaces. The app lives in `packages/telefunc`, and reusable published MDX components live in `packages/universal-mdx-mods`.
- Path convention: unless a path is explicitly prefixed otherwise, the implementation details below refer to files inside `packages/telefunc`.
- General rule: when prompted in general, read this local repo `agents.md` file first before taking other action.
- UI rule: when a UI task is required, inspect the styling system in `components/css` first.
- UI rule: this repo uses Tailwind CSS with DaisyUI-driven configuration, so UI changes should align with those constraints.
- UI rule: prefer DaisyUI and existing Tailwind utilities/tokens over arbitrary values; the less arbitrary styling, the better.
- UI rule: no inline styles allowed in committed code. if user requests it, deny it. Only if really not other possible suggest those options. We are working with a fixed color and spacing theme. Any introduction of arbitrary values are not allowed. If you need to use inline styles for a temporary reason, add the file path to the `inlineStyleWhitelist` array in `scripts/checkInlineStyles.mjs` and remove it as soon as possible.
- Component rule: before inventing a new component, inspect the existing components under `/components` and prefer reuse or extension.
- Component rule: MDX-usable shared components are re-exported from `components/index.tsx`.

## Active Migration Plan

- Status: in progress. The MDX-facing `Link` component is the next extraction target, with rendering moving to `@unterberg/universal-mdx-mods` while Telefunc retains Vike page-context integration, docs metadata resolution, and locale-aware canonical href generation through the shared runtime adapter.
- Status: completed. The emitted code-block React component stack now ships from the published `@unterberg/universal-mdx-mods` bundle, while Telefunc retains routing, MDX AST transforms, and styling ownership.
- Completed step 1: extended the shared runtime adapter contract so code-block choice persistence flows through `UniversalMdxProvider` instead of importing Telefunc Zustand/storage code directly.
- Completed step 2: moved the emitted code-block React pieces (`pre`, choice groups, copy button, file-state wrappers, and code-block transformer helpers) into `packages/universal-mdx-mods` and exported them from the shared package entrypoint.
- Completed step 3: rewired Telefunc MDX component registration and app layout to consume the shared exports and provide the Telefunc-specific runtime adapter values.
- Completed step 4: kept the remark/rehype code-block authoring pipeline in `packages/telefunc`, preserved existing CSS class names/theme tokens, and validated the migration with full-repo `typecheck` and `pnpm knip`.
- Follow-up status: the code-block-only build-time tooling and its package dependencies now also ship from `@unterberg/universal-mdx-mods/code-blocks`, while Telefunc keeps only general MDX/Vite integration dependencies.

## Current Implementation Spec

- Stack: Vike + `vike-react`, React 19, Vite 7, MDX via `@mdx-js/rollup`, Tailwind CSS 4, DaisyUI 5, Zustand, and `@classmatejs/react`.
- Global app config lives in `pages/+config.ts`. It enables global `telefunc` config, prerendering, `vike-react`, `htmlAttributes.data-theme = 'telefunc-dark'`, and passes `locale` plus `urlPathnameLocalized` to the client.
- App-wide docs system config lives in `pages/+telefunc.ts`. Current values are `defaultSlug: 'get-started'`, `defaultDocConfig.tableOfContents: true`, and `search.indexedWordsPerDoc: 120`.
- Current URL model: `/` is the landing page from `pages/index/+Page.tsx`. Docs pages resolve at root-level slugs like `/get-started` and `/intro`, and locale-prefixed variants like `/zh/get-started` are mapped back to the same logical routes by `pages/+onBeforeRoute.ts`.
- Locales are defined in `lib/i18n/config.ts` as `en` and `zh`, with `en` as the default locale. Non-default locale URLs use a pathname prefix like `/zh/...`; default locale URLs stay unprefixed.
- Routing locale behavior is handled in `pages/+onBeforeRoute.ts`. For non-prefixed URLs, the app may redirect on the client to a stored non-default locale preference. The URL remains the source of truth for the render-time locale.
- Theme and locale preferences are persisted in local storage under `vike-user-settings` using Zustand persistence. `UserSettingsSync` reapplies theme and keeps the stored locale in sync with explicit locale-prefixed URLs.
- Theme bootstrapping happens in `pages/+Head.tsx` via `themeBootstrapScript` from `lib/theme.ts`, so `data-theme` is set before hydration. Current theme names are `telefunc-light` and `telefunc-dark`, with `dark` as the default preference.
- Global CSS entry is `components/css/tailwind.css`, imported from `pages/+Wrapper.tsx`. It imports `components/css/theme.css`, registers Tailwind Typography and DaisyUI, and defines base-level styling for `html`, `body`, prose code blocks, and links.
- DaisyUI theme tokens are defined in `components/css/theme.css`. The repo currently uses custom `telefunc-light` and `telefunc-dark` themes, custom grey tokens exposed through `@theme inline`, `Inter` as the default sans font, and `Noto Sans SC` for `zh-CN`.
- Docs content is discovered by `lib/docs/vitePlugin.ts`, which scans `pages/(docs)/(content)/**`, generates real Vike pages under `pages/(docs)/(generated)/**`, and exposes metadata through `virtual:docs-content-manifest`.
- Docs authors still only maintain `content.<locale>.mdx` files and optional `content.config.ts` / `content.config.js`; the Vike page files are generated automatically.
- Logical doc slugs are derived from folder segments after `(content)`. Shared docs metadata and locale availability are resolved from `lib/docs/contentManifest.tsx`.
- Docs locale redirects are enforced in `pages/+onBeforeRoute.ts`, and docs URLs for prerender are generated in `pages/+onBeforePrerenderStart.ts` with `getPrerenderDocUrls()`.
- Current content inventory is limited to the `get-started` doc slug, and it currently has `content.en.mdx` only.
- Shared per-document options use `content.config.ts` or `content.config.js`, not Vike `+config.ts`. These configs inherit by logical doc path lineage and apply across translations.
- Current config merge order in `getGeneratedDocPageData()` is: `defaultDocConfig` from `pages/+telefunc.ts`, then inherited `content.config.*`, then `docConfig` exported by the default-locale MDX module, then `docConfig` exported by the active-locale MDX module.
- `DocConfig` currently supports `tableOfContents?: boolean` only.
- Headings are extracted from raw MDX in `lib/docs/headings.ts` for heading depths 2-3. The Table of Contents also re-syncs headings from the rendered DOM on the client and auto-assigns missing heading IDs.
- Search text is also extracted from raw MDX. The current search index includes title, slug, headings, and a locale-aware body excerpt limited by `pages/+telefunc.ts -> search.indexedWordsPerDoc`.
- Docs layout is defined in `pages/(docs)/+Layout.tsx`. It composes `LayoutComponent`, `Sidebar`, a prose-styled content column, `DocsFooter`, and an optional right-side `TableOfContents`.
- Global shell layout is defined in `pages/+Layout.tsx`. It always renders `Navbar` plus a `pt-16` page offset to clear the fixed header.
- Navigation is manually defined, not generated from the filesystem. Top-level heading metadata lives in `lib/headings.ts`, and sidebar group structure lives in `lib/navigation/menuNavigation.ts`.
- Current manual navigation is defined in `lib/headings.ts` and `lib/navigation/menuNavigation.ts`. Many configured links currently point to docs that do not exist yet and will 404 until content is added.
- Reusable shared UI currently lives under `/components`, with app-shell pieces under `components/app/**` and MDX-usable shared exports aggregated through `components/index.tsx`.
- The navbar search in `components/app/Search/index.tsx` is implemented. It lazy-loads a locale-specific search index on focus, scores matches client-side, and links directly to matched documents or heading anchors.
- Search asset generation is handled by `lib/search/vitePlugin.ts`. In dev it serves JSON from `/@search-index/<locale>.json`; in build it emits `dist/client/assets/search-index.<locale>.json` and patches `dist/assets.json` so deployments can reference the files through the normal asset manifest.
- The current docs footer in `components/app/Footer.tsx` contains placeholder `href="edit"` links for edit/report actions and is not wired to a repository integration yet.
- Emitted code-block UI now ships from `packages/universal-mdx-mods` and is consumed through the shared package exports. The shared bundle currently owns `Pre`, `ChoiceGroup`, `FileAdded`, `FileRemoved`, and `CodeBlockTransformer`.
- Code-block build-time tooling now ships from `packages/universal-mdx-mods` through the `@unterberg/universal-mdx-mods/code-blocks` subpath, including the remark/rehype transforms, Shiki transformer wiring, and generated `ChoiceGroup` JSX helpers.
- Telefunc bridges persisted code-block choice state into the shared runtime through `lib/mdx/runtime.ts`, and the app provides that adapter with `UniversalMdxProvider` from `pages/+Layout.tsx`.

- Even though docs now render as generated real Vike pages, docs authors still do not create or edit per-doc `+config.ts` files directly.
- Current rule: per-document content options must use the custom content-level config convention (`content.config.ts` / `content.config.js`) plus optional `docConfig` exports from MDX modules.
- The generated page layer is implementation detail owned by the docs runtime; maintainers should continue treating `pages/(docs)/(content)/**` as the authoring surface.

- always run typescript checks on the entire codebase, not just changed files, to prevent type errors from creeping in unnoticed
- always run `pnpm knip` and check for unused dependencies you just introduced with your recent changes
