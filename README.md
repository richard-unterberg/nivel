## nivel ✨

static site builder for mdx documentations - alpha

⚠️ This project is under development and built in mind to mainly support vike & telefunc documentation pages.
Expect breaking changes on engine updates.

Ok, with that out of the way, have fun:

## Install

```bash
pnpm add @unterberg/nivel react react-dom vike vike-react
pnpm add -D vite typescript @types/react @types/react-dom
```

`vike` and `vite` are peer dependencies. The package exposes a local `nivel` binary after install.

## Quick Start

Scaffold a consumer:

```bash
pnpm exec nivel init
```

Generate docs pages:

```bash
pnpm exec nivel prepare
```

[Read more here](https://github.com/richard-unterberg/nivel/blob/master/packages/engine/README.md) 

https://www.npmjs.com/package/@unterberg/nivel

### [`packages/engine`](packages/engine)

Main reusable package that exports the core engine and public helpers for consumer use. The engine is framework-agnostic and can be used in any React-based setup, but we currently only export a Vike config helper for convenience.

### [`packages/docs`](packages/docs)

First-party documentation site and in-repo integration consumer. It exercises the workspace engine against the release docs while remaining a reference implementation for consumers.

### [`tests/npm-consumer`](tests/npm-consumer)

Standalone npm fixture that installs the published package outside the workspace and validates the consumer contract from a real package install. This is the final gatekeeper for ensuring we don't accidentally break consumers with changes to the engine.
