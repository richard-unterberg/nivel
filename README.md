# nivel

Early alpha docs engine for Vike + Vite + React.

The repo currently contains three important pieces:

- `packages/engine`: the reusable `@unterberg/nivel` package
- `packages/consumer-dev`: the main in-repo consumer, currently exercising the engine against Telefunc docs content
- `tests/npm-consumer`: a standalone npm fixture that installs the published package outside the workspace and validates the consumer contract from a real package install

Current engine capabilities include:

- docs graph validation and resolution
- generated Vike routes for docs pages
- docs shell primitives such as navbar, sidebar, table of contents, pagination, and meta head wiring
- MDX integration with built-in docs components and code-block transforms
- search wiring via optional Algolia config
- theme preference wiring and engine-owned font assets

Recommended consumer split:

- hand-authored: `pages/+docs.ts`, `docs/docs.graph.ts`, docs content, consumer CSS/Tailwind/theme files, brand assets, and optional leaf components
- scaffolded once but still local and editable: `pages/+config.ts`, `pages/+Head.tsx`, `pages/+Layout.tsx`, `pages/+onCreateGlobalContext.ts`, `pages/+Wrapper.tsx`, and `global.d.ts`

The engine provides:

- `defineDocsConfig()` and `defineDocsGraph()` identity helpers for typed authoring, with a lean config-time entry at `@unterberg/nivel/config`
- `@unterberg/nivel/vike` as the engine-owned Vike config you spread into the consumer's normal `+config.ts`
- `nivel prepare` for docs page code generation
- `nivel init` for scaffolding the visible consumer shell files and package scripts

Consumer CSS remains hand-authored. `nivel init` does not create or overwrite Tailwind or theme files.

## Package CLI

After installing `@unterberg/nivel`, the package exposes the `nivel` binary in your app.

Typical first-time setup in a consumer:

```bash
npx nivel init
```

If you already have the package installed and want to use your package manager's local binary resolution:

```bash
pnpm exec nivel init
npm exec nivel init
```

Generate docs pages from `pages/+docs.ts`:

```bash
npx nivel prepare
```

Current CLI commands:

```bash
nivel init [--root <path>] [--force]
nivel prepare [--root <path>]
nivel --help
```

What they do:

- `nivel init`: scaffold the visible consumer files such as `pages/+config.ts`, `pages/+Head.tsx`, `pages/+Layout.tsx`, `pages/+onCreateGlobalContext.ts`, `pages/+Wrapper.tsx`, `global.d.ts`, `pages/+docs.ts`, and `docs/docs.graph.ts`
- `nivel init --force`: overwrite those scaffold-managed files if they already exist
- `nivel init --root <path>`: scaffold a consumer at another directory instead of the current working directory
- `nivel prepare`: generate `(nivel-generated)` docs routes and data files from your docs config
- `nivel prepare --root <path>`: run generation for another consumer root
- `nivel --help`: print the current CLI usage

## Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm typecheck
pnpm format
pnpm knip
```
