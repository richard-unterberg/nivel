# Nivel Architecture

- This repo is a pnpm TypeScript monorepo with two workspace packages: `packages/engine` and `packages/docs`. It also contains the standalone npm fixture at `tests/npm-consumer`.
- `@unterberg/nivel` owns the docs runtime. That includes Vike integration, MDX/Vite setup, graph validation, route code generation, page-shell rendering, and any engine-provided UI primitives.
- `packages/docs` is the first-party documentation site and in-repo integration consumer. It should stay thin and own docs content, `content/docs.graph.ts`, `pages/+docs.ts`, and any optional leaf-level custom components needed by content.
- `tests/npm-consumer` is the external-consumer compatibility fixture. Keep it aligned with the recommended published-package integration, not workspace-only shortcuts.
- `docs/docs.graph.ts` is the single source of truth for docs structure. Do not introduce consumer-owned `headings.ts`, `menuNavigation.ts`, or duplicated route metadata.
- Generated pages under `packages/docs/pages/(nivel-generated)` are engine internals. They may be regenerated at any time and must not be edited by hand.
- Prefer moving logic into `@unterberg/nivel` over duplicating docs behavior inside the consumer.
- The standard visible consumer shell files are `pages/+config.ts`, `pages/+Head.tsx`, `pages/+Layout.tsx`, `pages/+onCreateGlobalContext.ts`, `pages/+Wrapper.tsx`, and `global.d.ts`. They should remain local, visible, and editable in the consumer even when scaffolded by the CLI.
- Consumer CSS and Tailwind/theme files stay hand-authored. Do not move them into engine-generated scaffolding.
- When the user provides repo URLs as alignment references, inspect those repos before adapting UI, branding, layout, or content structure. Do not rely on memory or placeholders when a reference repo/package was supplied.
- UI structure belongs in `@unterberg/nivel`; theme files and palette tokens belong in the consumer.
- Fonts and reusable font-loading belong in `@unterberg/nivel`; brand logo and favicons remain consumer-owned assets in `packages/docs`.
- Navbar and sidebar behavior must be driven by the unified docs graph, not by separate manual navigation files.
- Code style rule: use arrow functions only. Do not introduce `function` declarations in repo code.
- Migrated MDX/content must be passed through the repo formatter after import and path rewrites; do not copy legacy content over unformatted.
- Finish workspace changes by running `pnpm verify` to run all checks and tests, including the engine tests. Do not skip this step.

- do not again add `defineDocsConfig` or `defineDocsGraph` helpers that wrap the config/graph objects. They add no value and just create an extra step for users to understand and import from the engine. The only reason they exist in the current code is that they were needed for internal type inference during early development, but now they are redundant and just add confusion. The engine should export the types for `DocsConfig` and `DocsGraph`, but the consumer can just create plain objects that satisfy those types without needing wrapper functions. If you do that ever again I swear I will unsubscribe open ai plus.
