# Solid -> React Refactor Plan

## Repo Scan Summary

- Current runtime is still Solid-first:
  - `package.json` uses `solid-js`, `vike-solid`, `vite-plugin-solid`, `@classmatejs/solid`, `lucide-solid`
  - `tsconfig.json` is mixed: `jsx` is already `react-jsx`, but `jsxImportSource` is still `solid-js` and `types` still include `vike-solid/client`
  - `vite.config.ts` is wired to `vike-solid/vite` and `vite-plugin-solid`
- React-oriented packages are partially present already:
  - `@classmatejs/react`
  - `lucide-react`
  - React runtime packages are not present yet
- Solid-specific code is spread across app shell, docs shell, MDX runtime, and shared components.
- The biggest non-obvious migration surface is the MDX/rendering pipeline:
  - `lib/mdx/jsx-runtime.tsx`
  - `lib/mdx/jsx-dev-runtime.tsx`
  - `lib/docs/content.tsx`
  - `vite.config.ts`
- Docs content is small right now:
  - `pages/(docs)/get-started/content.en.mdx`
  - `pages/(docs)/get-started/content.zh.mdx`
  - `pages/(docs)/bodyAttributes/content.en.mdx`

## Scope

Primary goal: convert this repo from Solid to React without changing the site structure, docs routing model, i18n behavior, MDX content model, or visual design intent.

Explicit migration targets:

- Replace Solid runtime and Vike Solid integration with React equivalents
- Replace `@classmatejs/solid` with `@classmatejs/react`
- Replace `lucide-solid` with `lucide-react`
- Update `package.json`, lockfile, and `tsconfig.json`
- Convert Solid JSX/component patterns to React patterns
- Keep the current route tree and localized MDX workflow intact

Non-goals for the first pass:

- Redesigning the UI
- Reworking docs information architecture
- Introducing client-side navigation changes beyond what React + Vike requires
- Expanding MDX authoring features beyond current behavior

## Execution Constraints

- Do not overwrite the user’s existing `package.json` edits blindly. It is already dirty in git.
- Keep the migration shippable in phases. Do not leave mixed Solid/React framework glue in mainline files longer than one phase.
- Prefer a vertical slice validation after each major phase instead of one large blind rewrite.

## Recommended Agent Split

### Agent 0: Integrator / Migration Control

Owns:

- `package.json`
- `pnpm-lock.yaml`
- `tsconfig.json`
- `vite.config.ts`
- `pages/+config.ts`
- `vike.d.ts`

Responsibilities:

- Replace Solid framework dependencies with React ones
- Align Vite + Vike plugin setup for React
- Align TypeScript JSX/runtime types
- Coordinate install/typecheck/build checkpoints
- Resolve version compatibility between `vike`, `vike-react`, `react`, `react-dom`, and MDX tooling

Expected package-level changes:

- Add `react`
- Add `react-dom`
- Add `vike-react`
- Add `@vitejs/plugin-react`
- Keep `@classmatejs/react`
- Keep `lucide-react`
- Remove `solid-js`
- Remove `vike-solid`
- Remove `vite-plugin-solid`
- Remove `@classmatejs/solid`
- Remove `lucide-solid`

Expected config-level changes:

- `tsconfig.json`
  - remove `vike-solid/client`
  - add React/Vike React client typings as needed
  - remove `jsxImportSource: "solid-js"`
  - keep `jsx: "react-jsx"`
- `vite.config.ts`
  - replace Solid plugin wiring with React plugin wiring
  - replace `vike-solid/vite` with React equivalent
  - keep MDX integration and alias setup working
- `pages/+config.ts`
  - replace `vike-solid/config` extension with the React integration

### Agent 1: MDX / Runtime Conversion

Owns:

- `lib/mdx/jsx-runtime.tsx`
- `lib/mdx/jsx-dev-runtime.tsx`
- `lib/docs/content.tsx`
- `pages/(docs)/DocPage.tsx`

Responsibilities:

- Remove Solid-only MDX runtime assumptions
- Ensure MDX modules compile and render as React components
- Replace Solid component typing with React component typing
- Remove `Dynamic`, `Show`, and memo wrappers that are only there for Solid

Key migration notes:

- `lib/mdx/jsx-runtime.tsx` currently depends on `solid-js/web` `Dynamic`
- `lib/docs/content.tsx` types MDX modules as Solid `Component`
- `pages/(docs)/DocPage.tsx` uses `createMemo`, `Show`, and `Dynamic`
- This workstream should produce a simple React-compatible MDX render path before broader component conversion proceeds

### Agent 2: App Shell / Shared Components

Owns:

- `pages/+Layout.tsx`
- `pages/+Wrapper.tsx`
- `pages/+Head.tsx`
- `pages/index/+Page.tsx`
- `pages/_error/+Page.tsx`
- `components/LayoutComponent.tsx`
- `components/ThemeSwitch.tsx`
- `components/LanguageSwitch.tsx`
- `components/Link.tsx`
- `components/ConfigSpec.tsx`

Responsibilities:

- Replace `usePageContext` imports with React-side equivalents
- Convert Solid types:
  - `JSXElement` -> `ReactNode`
  - `Component` -> `ComponentType` or equivalent
  - `ValidComponent` -> React element/component typing as needed
- Convert Solid control flow/state/lifecycle to React
- Replace `class=` with `className=`
- Replace `@classmatejs/solid` helpers with `@classmatejs/react`
- Replace Solid icon imports with `lucide-react`

Key migration notes:

- `ThemeSwitch.tsx` is a direct `createSignal`/`onMount` -> `useState`/`useEffect` conversion
- `LanguageSwitch.tsx` and `Link.tsx` currently use `createMemo`; those can likely become plain derived values or `useMemo` only if needed
- `LayoutComponent.tsx` is the best early proof point for `@classmatejs/react` API parity
- `pages/+Head.tsx` is simple, but it should be rewritten cleanly rather than mechanically porting memo usage

### Agent 3: Docs Chrome / Navigation

Owns:

- `pages/(docs)/+Layout.tsx`
- `pages/(docs)/Footer.tsx`
- `pages/(docs)/TableOfContents.tsx`
- `pages/(docs)/Sidebar/index.tsx`
- `pages/(docs)/Sidebar/ApiTab.tsx`
- `pages/(docs)/Sidebar/MenuTab.tsx`
- `pages/(docs)/Sidebar/SidebarNavigation.tsx`

Responsibilities:

- Convert the docs shell to React without changing behavior
- Replace Solid control-flow primitives:
  - `Show` -> conditional rendering
  - `For` -> `.map()`
  - `createMemo` -> plain derived values or `useMemo`
  - `createSignal` -> `useState`
  - `onMount` / `onCleanup` / `createEffect` -> `useEffect`
- Replace Solid icon types/imports in sidebar metadata
- Convert `classmate` helpers and `class` attributes

Highest-risk file:

- `pages/(docs)/TableOfContents.tsx`

Why it is risky:

- It mixes scroll state, hash tracking, DOM querying, route-dependent re-sync, and cleanup
- It must not double-register listeners after React effect conversion
- It must preserve active heading behavior on:
  - initial load
  - hash changes
  - scrolling
  - resizing
  - route transitions

### Agent 4: Verification / Cleanup

Owns:

- final grep cleanup
- typecheck/build verification
- regression checklist

Responsibilities:

- Remove all Solid imports and stale Solid package references
- Ensure no `class=` remains in TSX
- Ensure no `vike-solid` imports remain
- Ensure no `lucide-solid` or `@classmatejs/solid` imports remain
- Validate route behavior and docs interactions

Required final grep checks:

- `rg -n "solid-js|solid-js/web|vike-solid|lucide-solid|@classmatejs/solid"`
- `rg -n "\\bclass=" --glob '*.tsx'`
- `rg -n "createSignal|createMemo|createEffect|onMount|onCleanup|<Show|<For|Dynamic"`

## Planned Migration Order

### Phase 0: Baseline and dependency alignment

1. Review the user’s in-progress `package.json` changes before editing.
2. Update framework dependencies and dev dependencies.
3. Update `tsconfig.json`.
4. Update `vite.config.ts`.
5. Update `pages/+config.ts`.
6. Install dependencies and confirm the repo resolves with React packages in place.

Exit criteria:

- dependency graph installs cleanly
- no Solid-only framework plugin remains in config
- TypeScript sees React JSX/runtime types

### Phase 1: Make MDX rendering React-compatible

1. Convert `lib/mdx/jsx-runtime.tsx`
2. Convert `lib/mdx/jsx-dev-runtime.tsx`
3. Convert `lib/docs/content.tsx`
4. Convert `pages/(docs)/DocPage.tsx`

Exit criteria:

- MDX files compile
- doc pages can render a localized MDX component in React
- no Solid `Dynamic` dependency remains

### Phase 2: Convert shared shell and leaf components

1. Convert `components/LayoutComponent.tsx`
2. Convert `components/ThemeSwitch.tsx`
3. Convert `components/LanguageSwitch.tsx`
4. Convert `components/Link.tsx`
5. Convert page shell files:
   - `pages/+Layout.tsx`
   - `pages/+Wrapper.tsx`
   - `pages/+Head.tsx`
   - `pages/index/+Page.tsx`
   - `pages/_error/+Page.tsx`

Exit criteria:

- global layout renders
- language switcher and theme switcher still work
- header/footer shell compiles without Solid types or imports

### Phase 3: Convert docs shell and navigation

1. Convert `pages/(docs)/+Layout.tsx`
2. Convert `pages/(docs)/Footer.tsx`
3. Convert sidebar files
4. Convert `pages/(docs)/TableOfContents.tsx`

Exit criteria:

- docs pages render with sidebar and TOC
- tab switching works
- TOC active heading tracking still works

### Phase 4: Cleanup and verification

1. Remove any remaining Solid references
2. Run grep cleanup checks
3. Run typecheck
4. Run build
5. Smoke test key routes and interactions

## File-by-File Expectations

### Config and framework glue

- `package.json`
  - replace framework packages
  - preserve existing script contract unless React migration forces a script change
- `tsconfig.json`
  - React typings only
  - no Solid JSX import source
- `vite.config.ts`
  - React plugin stack
  - MDX remains pre-transform
- `pages/+config.ts`
  - React integration instead of Solid integration
- `vike.d.ts`
  - likely mostly unchanged, but confirm Vike React page context typing compatibility

### MDX and content

- `lib/mdx/jsx-runtime.tsx`
  - likely becomes a thin React JSX runtime bridge or re-export strategy
- `lib/docs/content.tsx`
  - MDX module types become React component types
- `pages/(docs)/DocPage.tsx`
  - direct React render of selected doc component

### Shared UI

- `components/LayoutComponent.tsx`
  - prove `@classmatejs/react` API parity
- `components/ThemeSwitch.tsx`
  - state/effect conversion
- `components/LanguageSwitch.tsx`
  - list rendering and event typing conversion
- `components/Link.tsx`
  - memo removal and React node typing

### Docs UI

- `pages/(docs)/Sidebar/SidebarNavigation.tsx`
  - `LucideIcon` type migration
  - `JSXElement` titles become `ReactNode`
  - `For` loops become `.map()`
- `pages/(docs)/Sidebar/index.tsx`
  - `createSignal` -> `useState`
- `pages/(docs)/TableOfContents.tsx`
  - effect-driven DOM sync rewrite

## Behavior Checklist For QA

Routes:

- `/`
- `/get-started`
- `/bodyAttributes`
- `/zh/get-started`
- `/zh/bodyAttributes`

Interactions:

- header renders on all pages
- language switch changes locale and full reload still works
- theme switch toggles `data-theme`
- docs sidebar switches between Documentation and API Reference
- active sidebar states still match localized routes
- TOC appears only when headings exist
- TOC active item updates on scroll
- TOC hash links still jump correctly
- error page still renders correct 404 vs generic error copy

Content:

- localized MDX selection still falls back from `zh` to `en`
- heading extraction still works from raw MDX

## Known Risks

- `@classmatejs/react` may not be perfectly API-identical to `@classmatejs/solid`; validate on `LayoutComponent` and `TableOfContents` before broad conversion.
- `lucide-react` import style is usually different from `lucide-solid`; standardize import style early to avoid churn.
- Vike React integration may require slightly different client typing or hook import paths than assumed here; confirm during Phase 0 before touching many files.
- React effect timing in `TableOfContents` may expose duplicate sync or stale closure issues if ported mechanically.
- MDX runtime wiring is the main place where a naive search-and-replace can fail even if the rest of the app compiles.

## Definition of Done

- The repo runs on React, not Solid
- `package.json`, `tsconfig.json`, and `vite.config.ts` are React-aligned
- All TSX files use React-compatible JSX and typing
- `@classmatejs/react` and `lucide-react` are fully adopted
- No Solid imports or Solid packages remain
- `pnpm typecheck` passes
- `pnpm build` passes
- Key docs/i18n interactions still work
