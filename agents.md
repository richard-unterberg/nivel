# Docs Architecture Note

- General rule: when prompted in general, read this local repo `agents.md` file first before taking other action.
- UI rule: when a UI task is required, inspect the styling system in `components/css` first.
- UI rule: this repo uses Tailwind CSS with DaisyUI-driven configuration, so UI changes should align with those constraints.
- UI rule: prefer DaisyUI and existing Tailwind utilities/tokens over arbitrary values; the less arbitrary styling, the better.
- Component rule: before inventing a new component, inspect the existing components under `/components` and prefer reuse or extension.
- Component rule: the exact path for MDX-usable components will be specified later when they move into their own directory.

## Current Implementation Spec

- Stack: Vike + `vike-react`, React 19, Vite 7, MDX via `@mdx-js/rollup`, Tailwind CSS 4, DaisyUI 5, Zustand, and `@classmatejs/react`.
- Global app config lives in `pages/+config.ts`. It enables global `mdex` config, prerendering, `vike-react`, `htmlAttributes.data-theme = 'vike-dark'`, and passes `locale` plus `urlPathnameLocalized` to the client.
- App-wide docs system config lives in `pages/+mdex.ts`. Current values are `basePath: ''`, `defaultSlug: 'get-started'`, and `defaultDocConfig.tableOfContents: true`.
- Current URL model: `/` is the landing page from `pages/index/+Page.tsx`. Docs pages are served from the single dynamic Vike subtree at `pages/(docs)/(config)`. Because `basePath` is currently `''`, docs resolve at root-level slugs like `/get-started` and `/intro` instead of under `/docs`.
- Locales are defined in `lib/i18n/config.ts` as `en` and `zh`, with `en` as the default locale. Non-default locale URLs use a pathname prefix like `/zh/...`; default locale URLs stay unprefixed.
- Routing locale behavior is handled in `pages/+onBeforeRoute.ts`. For non-prefixed URLs, the app may redirect on the client to a stored non-default locale preference. The URL remains the source of truth for the render-time locale.
- Theme and locale preferences are persisted in local storage under `vike-user-settings` using Zustand persistence. `UserSettingsSync` reapplies theme and keeps the stored locale in sync with explicit locale-prefixed URLs.
- Theme bootstrapping happens in `pages/+Head.tsx` via `themeBootstrapScript` from `lib/theme.ts`, so `data-theme` is set before hydration. Current theme names are `vike-light` and `vike-dark`, with `dark` as the default preference.
- Global CSS entry is `components/css/tailwind.css`, imported from `pages/+Wrapper.tsx`. It imports `components/css/theme.css`, registers Tailwind Typography and DaisyUI, and defines base-level styling for `html`, `body`, prose code blocks, and links.
- DaisyUI theme tokens are defined in `components/css/theme.css`. The repo currently uses custom `vike-light` and `vike-dark` themes, custom grey tokens exposed through `@theme inline`, `Inter` as the default sans font, and `Noto Sans SC` for `zh-CN`.
- Docs content is discovered through `import.meta.glob` in `lib/docs/content.tsx`. The system eagerly loads `pages/**/content.*.mdx`, raw MDX source for heading extraction, and `pages/**/content.config.{ts,js}` for shared content-level config.
- The docs runtime is content-module based, not page-subtree based. MDX files under `pages/(docs)/(content)/**` are parsed and registered as content entries, while the rendered page remains the single dynamic Vike page under `pages/(docs)/(config)`.
- Logical doc slugs are derived from folder segments after `(content)`. Route matching is implemented in `pages/(docs)/(config)/+route.ts` using helpers from `lib/docs/systemConfig.ts`.
- Docs existence and redirects are enforced in `pages/(docs)/(config)/+guard.ts`. Empty slug requests resolve to `defaultSlug`, and missing docs render the docs-specific 404 page.
- Prerendered docs URLs are generated in `pages/(docs)/(config)/+onBeforePrerenderStart.ts` using `getPrerenderDocUrls()`, which expands all locales and all discovered doc slugs.
- Current content inventory is limited to the `get-started` and `intro` doc slugs, each with `content.en.mdx` and `content.zh.mdx`.
- Shared per-document options use `content.config.ts` or `content.config.js`, not Vike `+config.ts`. These configs inherit by logical doc path lineage and apply across translations.
- Current config merge order in `getDocPage()` is: `defaultDocConfig` from `pages/+mdex.ts`, then inherited `content.config.*`, then `docConfig` exported by the default-locale MDX module, then `docConfig` exported by the active-locale MDX module.
- `DocConfig` currently supports `tableOfContents?: boolean` only. Example: `pages/(docs)/(content)/intro/content.config.ts` disables the table of contents for the intro page.
- Headings are extracted from raw MDX in `lib/docs/headings.ts` for heading depths 2-3. The Table of Contents also re-syncs headings from the rendered DOM on the client and auto-assigns missing heading IDs.
- Docs layout is defined in `pages/(docs)/(config)/+Layout.tsx`. It composes `LayoutComponent`, `Sidebar`, a prose-styled content column, `DocsFooter`, and an optional right-side `TableOfContents`.
- Global shell layout is defined in `pages/+Layout.tsx`. It always renders `Navbar` plus a `pt-16` page offset to clear the fixed header.
- Navigation is manually defined, not generated from the filesystem. Top-level heading metadata lives in `lib/headings.ts`, and sidebar group structure lives in `lib/navigation/menuNavigation.ts`.
- Current manual navigation includes links for `get-started`, `components/overview`, and `guides/overview`. Only `get-started` currently exists as real content among those linked destinations; missing linked docs will 404 until content is added.
- Reusable shared UI currently lives under `/components`, including `Alert`, navbar parts, sidebar parts, footer, TOC, social icons, and link helpers. Existing MDX already imports shared components directly, for example `Alert` in `pages/(docs)/(content)/intro/content.en.mdx`.
- The current search control in `components/Navbar/Search.tsx` is UI-only. It renders an input shell with hover styling but has no implemented search indexing or query behavior yet.
- The current docs footer in `components/Footer.tsx` contains placeholder `href="edit"` links for edit/report actions and is not wired to a repository integration yet.

- Per-document config under `pages/(docs)/(content)/**` cannot use real Vike `+config.ts` resolution with the current architecture.
- Reason: the rendered docs page is the single dynamic page under `pages/(docs)/(config)`, while the MDX content folders are only parsed as content modules and are not part of the matched Vike page tree.
- Implication: a file next to `content.en.mdx` or `content.zh.mdx` is not in the rendered page's Vike config ancestry, so Vike will not expose it through `pageContext.config`.
- Current rule: per-document content options must use the custom content-level config convention, not Vike `+config.ts`.
- Real Vike per-document config becomes possible only after an architecture refactor where each document directory is itself a real Vike page subtree, for example `pages/(docs)/intro/+Page.tsx` with `pages/(docs)/intro/+config.ts`.
