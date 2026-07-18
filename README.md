## nivel ✨

static site builder for mdx documentations - public alpha

https://nivel-docs.de/

## Install

```bash
pnpm add @unterberg/nivel react react-dom vike vike-react
# typescript:
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

[Read more here on the website:](https://nivel-docs.de/) 

https://www.npmjs.com/package/@unterberg/nivel

### [`packages/engine`](packages/engine)

Main reusable package that exports the core engine and public helpers for consumer use. The engine is framework-agnostic and can be used in any React-based setup, but we currently only export a Vike config helper for convenience.

### [`packages/docs`](packages/docs)

First-party documentation site and in-repo integration consumer. It exercises the workspace engine against the release docs while remaining a reference implementation for consumers.

## Certified R&D Project - FZulG

Nivel is an officially [BSFZ-certified](https://www.bescheinigung-forschungszulage.de/) R&D project under the German Research Allowance Act (FZulG).

![BSFZ Siegel 2026](https://github.com/richard-unterberg/nivel/blob/9f3590fefa461213f42835fdfe7e26180cbd8ecf/packages/docs/public/BSFZ_Siegel_RGB_1x.png "BSFZ Siegel 2026")

⚠️ Until mid 2027 - This project will be under continuous development. Expect breaking changes on engine updates, while the graph of the docs site should remain stable (non-breaking).