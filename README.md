# nivel

Opinionated, documentation site builder for Vike + Vite + React

### Overview:

| Workspace | Role |
| --- | --- |
| `packages/engine` | Reusable package |
| `packages/consumer-dev` | Main in-repo consumer, currently exercising the engine against Telefunc docs content |
| `tests/npm-consumer` | Standalone npm fixture that installs the published package outside the workspace and validates the consumer contract from a real package install |

### Features:

- docs graph validation and resolution
- generated Vike routes for docs pages
- docs shell primitives such as navbar, sidebar, table of contents, pagination, and meta head wiring
- MDX integration with built-in docs components and code-block transforms
- search wiring via optional Algolia config
- theme preference wiring and engine-owned font assets

The engine provides:

| Surface | Purpose |
| --- | --- |
| `defineDocsConfig()` and `defineDocsGraph()` | Identity helpers for typed authoring, with a lean config-time entry at `@unterberg/nivel/config` |
| `@unterberg/nivel/vike` | Engine-owned Vike config you spread into the consumer's normal `+config.ts` |
| `nivel prepare` | Docs page code generation |
| `nivel init` | Scaffolding for visible consumer shell files and package scripts |

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

| Command | Effect |
| --- | --- |
| `nivel init` | Scaffold the visible consumer files such as `pages/+config.ts`, `pages/+Head.tsx`, `pages/+Layout.tsx`, `pages/+onCreateGlobalContext.ts`, `pages/+Wrapper.tsx`, `global.d.ts`, `pages/+docs.ts`, and `docs/docs.graph.ts` |
| `nivel init --force` | Overwrite those scaffold-managed files if they already exist |
| `nivel init --root <path>` | Scaffold a consumer at another directory instead of the current working directory |
| `nivel prepare` | Generate `(nivel-generated)` docs routes and data files from your docs config |
| `nivel prepare --root <path>` | Run generation for another consumer root |
| `nivel --help` | Print the current CLI usage |

## Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm typecheck
pnpm format
pnpm knip
```
