# Tests

This directory is for integration-style fixtures around the Nivel monorepo, not for the engine unit tests themselves.

## What lives here

`npm-consumer/` is a standalone consumer app that exercises `@unterberg/nivel` the way an external user would consume it.

It is intentionally kept outside the pnpm workspace package flow so we can validate the real consumer contract instead of relying on workspace-only shortcuts.

## Why `npm-consumer` exists

The main workspace already covers engine development in `packages/engine` and the first-party docs app in `packages/docs`.

`tests/npm-consumer` covers a different concern:

- Can Nivel be installed and used like a normal package?
- Do the exported types and runtime APIs work from a separate app?
- Does route generation still work through `nivel prepare`?
- Can the consumer keep its own visible Vike shell files, CSS, and theme files?

In this repo the fixture currently points at the local engine package so branch changes can be validated before publishing, but the structure mirrors the recommended published-package setup.

## What to look at

- `tests/npm-consumer/package.json`: standalone install and scripts for `dev`, `build`, and `typecheck`
- `tests/npm-consumer/docs/docs.graph.ts`: minimal docs graph used as the fixture's source of truth
- `tests/npm-consumer/pages/`: consumer-owned visible shell files
- `tests/npm-consumer/styles/`: hand-authored styling that stays in the consumer

## How to use it

From the fixture directory:

```bash
cd tests/npm-consumer
npm install
npx nivel init
npm run dev
```

For non-interactive validation:

```bash
npm run build
npm run typecheck
```
