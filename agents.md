# Docs Architecture Note

- General rule: when prompted in general, read this local repo `agents.md` file first before taking other action.
- UI rule: when a UI task is required, inspect the styling system in `components/css` first.
- UI rule: this repo uses Tailwind CSS with DaisyUI-driven configuration, so UI changes should align with those constraints.
- UI rule: prefer DaisyUI and existing Tailwind utilities/tokens over arbitrary values; the less arbitrary styling, the better.
- Component rule: before inventing a new component, inspect the existing components under `/components` and prefer reuse or extension.
- Component rule: MDX-usable shared components are re-exported from `components/index.tsx`.

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

- Even though docs now render as generated real Vike pages, docs authors still do not create or edit per-doc `+config.ts` files directly.
- Current rule: per-document content options must use the custom content-level config convention (`content.config.ts` / `content.config.js`) plus optional `docConfig` exports from MDX modules.
- The generated page layer is implementation detail owned by the docs runtime; maintainers should continue treating `pages/(docs)/(content)/**` as the authoring surface.

- always run typescript checks on the entire codebase, not just changed files, to prevent type errors from creeping in unnoticed
- always run `pnpm knip` and check for unused dependencies you just introduced with your recent changes

## Code Block Refactor Plan Draft (2026-03-30)

- Goal: replace the current lightweight custom Shiki code-block path with a Tailwind/DaisyUI-styled port of the richer `brillout/docpress` code-block system, while keeping the visual language of this repo and preserving current docs authoring ergonomics.
- Upstream sources reviewed before planning:
  - `brillout/docpress/src/code-blocks/**`
  - `brillout/docpress/src/components/CodeBlockTransformer.tsx`
  - `brillout/docpress/src/components/FileRemoved.tsx`
  - `telefunc/telefunc/docs/pages/**`
- Important local constraints for the refactor:
  - keep styling aligned with `components/css/tailwind.css`, `components/css/theme.css`, Tailwind 4, and DaisyUI 5
  - preserve current MDX authoring in `pages/(docs)/(content)/**`
  - align the rendering trigger path with the real Telefunc/docs setup: MDX pipeline transforms plus MDX component injection, not a local manual `<CodeGroup>` wrapper API
  - preserve current landing-page hooks such as `[data-code-block-header]` and `[data-code-block-content]` so landing snippets keep working

### Scope To Port In Phase 1

- Port upstream metadata handling so fence meta becomes `<pre>` props, including `hide-menu`, `choice`, `file-added`, `file-removed`, `ts-only`, and `max-width`.
- Port upstream Shiki-driven behavior that materially changes output:
  - diff markers such as `// [!code ++]` / `// [!code --]`
  - highlight/word-highlight support from Shiki notation transformers
  - HTTPS autolinks inside code blocks
- Port upstream code-block transformations:
  - TypeScript-to-JavaScript toggle generation via `detype`
  - package-manager toggle generation for `npm`/`npx` shell blocks
  - adjacent block grouping via `choice=...`
  - `:::Choice{#...}` directive grouping support for mixed content, because it is part of the same upstream grouping system and is low marginal cost once `remark-directive` is in place
- Port upstream runtime behaviors:
  - copy button
  - persisted choice selection in local storage
  - scroll-position restore while switching choices
  - disabled select options when a configured choice group is only partially present
- Port upstream author-facing helpers that Telefunc docs already use:
  - `<FileAdded>`
  - `<FileRemoved>`
  - `<CodeBlockTransformer lineBreak="...">`
- Migrate local docs/examples away from `<CodeGroup>` usage and document the Telefunc-style triggering model instead:
  - adjacent fenced blocks grouped by `choice=...`
  - generated JS/TS toggles from `ts`/`tsx` fences through `detype`
  - generated package-manager toggles from `bash`/`sh`/`shell` fences
  - `:::Choice{#...}` directives for mixed-content grouped examples

### Planned Architecture

- Replace the current `rehypeShikiCodeBlocks`-only path with an upstream-style MDX pipeline:
  - `remarkDirective`
  - ported `remarkDetype`
  - ported `remarkPkgManager`
  - ported `remarkChoiceGroup`
  - `rehype-pretty-code` with the required Shiki transformers
  - ported `rehypeMetaToProps`
  - existing `rehypeDocHeadings`
- Keep the code-block logic under a local docs-owned namespace such as `lib/docs/codeBlocks/**`, with the upstream source used as the behavioral reference, not as a direct CSS/UI import.
- Move from the current tag-remap-only MDX setup to a local MDX components registry so injected MDX elements like `ChoiceGroup` resolve cleanly. Recommendation: add `providerImportSource` support and register `a`, `pre`, `ChoiceGroup`, `FileAdded`, `FileRemoved`, and `CodeBlockTransformer` there, matching the trigger model used by Telefunc/docpress.
- Keep the current custom `pre` rendering entry point conceptually, but have it be reached through MDX component injection rather than through a separate local author-facing wrapper API. Rebuild the runtime components around upstream behavior:
  - one shared Tailwind/DaisyUI code-block frame component
  - one choice-group component for upstream-generated groups
- Add a small head bootstrap script for stored choice selections, mirroring the repo’s existing theme bootstrap pattern, so choice-group SSR does not flicker or mismatch on hydration.

### UI Direction

- Do not import upstream plain CSS as-is.
- Rebuild the UI with local tokens and utilities:
  - DaisyUI `select`, `button`, `rounded-box`, and border/color tokens
  - local muted/base token palette from `components/css/theme.css`
  - existing prose/not-prose behavior from the docs layout
- Keep the current overall frame language:
  - bordered card container
  - compact header bar
  - inline language/choice controls
  - content area that still looks native to this site
- Add Tailwind-based equivalents for upstream diff/file-state visuals instead of the current CSS-only implementation.

### Compatibility And Risk Controls

- Preserve current plain fenced blocks with no meta.
- Preserve dark/light theme behavior and current dual-theme syntax colors.
- Avoid breaking heading extraction, search extraction, and generated docs page routing.
- Keep code-block logic isolated from generated Vike docs pages so docs authors continue editing only `content.<locale>.mdx` and optional `content.config.*`.
- Treat current local `<CodeGroup>` usage as migration surface, not a compatibility contract. The only known local usage is in `pages/(docs)/(content)/get-started/content.en.mdx`, and it should be rewritten to demonstrate the Telefunc/docpress triggering style.

### Suggested File Targets

- `vite.config.ts`
- `lib/docs/codeBlocks/**` for the ported remark/rehype/utility logic
- `lib/docs/shiki.ts` or a replacement module that owns shared Shiki configuration
- `components/docs/CodeBlock.tsx` or a split replacement under `components/docs/code-blocks/**`
- `components/index.tsx`
- `lib/mdx/**` for MDX component registration changes
- `components/app/MetaHead/**` for choice bootstrap support
- `components/css/tailwind.css` and possibly a small companion stylesheet area for code-block-specific base hooks

### Verification Plan

- Build a local MDX coverage page or fixture content that exercises:
  - plain fenced blocks
  - `choice=...`
  - `ts-only`
  - `max-width=...`
  - `hide-menu`
  - package-manager conversion
  - diff markers
  - `<FileAdded>` / `<FileRemoved>`
  - `<CodeBlockTransformer>`
  - `:::Choice{#...}` directives
- Update the local docs example content that currently demonstrates `<CodeGroup>` so it instead demonstrates the real trigger model used by Telefunc/docpress.
- Cross-check against real Telefunc docs examples in `/tmp/telefunc-upstream/docs/pages/**` while implementing, especially for `ts-only`, detype output, and warning pages that rely on code diff annotations.
- Run full-repo checks after implementation:
  - `pnpm typecheck`
  - `pnpm knip`

### Review Notes Before Implementation

- Recommended implementation strategy: port the upstream behavior first, then re-skin it to local Tailwind/DaisyUI primitives instead of trying to incrementally bolt features onto the current `rehypeShikiCodeBlocks` implementation.
- Recommended parity level: include the full upstream grouping pipeline in phase 1, not only the Telefunc pages currently using it, because the extra cost is modest and it avoids a second parser/runtime rewrite later.
