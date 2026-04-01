# vike-docpress workspace

This repo is a pnpm workspace with two packages:

- `packages/telefunc`: the Vike docs application
- `packages/universal-mdx-mods`: the publishable shared MDX component package

Package-specific details live in their local READMEs:

- `packages/telefunc/README.md`
- `packages/universal-mdx-mods/README.md`

## Getting Started

```bash
pnpm install
pnpm dev
```

That starts both workspace packages together:

- `@unterberg/universal-mdx-mods` builds in watch mode with `tsup`
- `packages/telefunc` runs the Vike dev server

The app is served from the `telefunc` package on port `3001`.

## Common Commands

From the workspace root:

- `pnpm dev`: run the shared package watcher and the app dev server together
- `pnpm dev:telefunc`: run only the Vike docs app
- `pnpm dev:mods`: run only the shared package watcher
- `pnpm build`: build the shared package and then the app
- `pnpm preview`: preview the built `telefunc` app
- `pnpm typecheck`: run full-workspace type checks
- `pnpm knip`: check workspace-level unused dependencies and exports
- `pnpm format`: format the repo with Biome
- `pnpm lint`: run Biome lint with fixes

## Development Model

`packages/telefunc` depends on `@unterberg/universal-mdx-mods` via `workspace:*`.

That means:

- app code always imports the shared package by package name
- local development still exercises the real package boundary
- changes in `packages/universal-mdx-mods` are rebuilt locally and consumed by `packages/telefunc`

This keeps local development close to the eventual npm-consumer setup without source aliasing the shared package.

## Repo Notes

- Repo-specific engineering instructions are tracked in `agents.md`.

## Publishing override
```
pnpm publish --access public --no-git-checks
```