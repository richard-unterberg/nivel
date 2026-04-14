# Nivel Architecture

- Read this file before making structural changes to the repo.
- This repo is a pnpm TypeScript monorepo with two workspace packages: `packages/engine` and `packages/consumer-dev`. It also contains the standalone npm fixture at `tests/npm-consumer`.
- `@unterberg/nivel` owns the docs runtime. That includes Vike integration, MDX/Vite setup, graph validation, route code generation, page-shell rendering, and any engine-provided UI primitives.
- `packages/consumer-dev` is intentionally thin. It should only own docs content, `docs/docs.graph.ts`, `pages/+docs.ts`, and any optional leaf-level custom components needed by content.
- `tests/npm-consumer` is the external-consumer compatibility fixture. Keep it aligned with the recommended published-package integration, not workspace-only shortcuts.
- `docs/docs.graph.ts` is the single source of truth for docs structure. Do not introduce consumer-owned `headings.ts`, `menuNavigation.ts`, or duplicated route metadata.
- Generated pages under `packages/consumer-dev/pages/(nivel-generated)` are engine internals. They may be regenerated at any time and must not be edited by hand.
- Prefer moving logic into `@unterberg/nivel` over duplicating docs behavior inside the consumer.
- The standard visible consumer shell files are `pages/+config.ts`, `pages/+Head.tsx`, `pages/+Layout.tsx`, `pages/+onCreateGlobalContext.ts`, `pages/+Wrapper.tsx`, and `global.d.ts`. They should remain local, visible, and editable in the consumer even when scaffolded by the CLI.
- Consumer CSS and Tailwind/theme files stay hand-authored. Do not move them into engine-generated scaffolding.
- When the user provides repo URLs as alignment references, inspect those repos before adapting UI, branding, layout, or content structure. Do not rely on memory or placeholders when a reference repo/package was supplied.
- UI structure belongs in `@unterberg/nivel`; theme files and palette tokens belong in the consumer.
- Fonts and reusable font-loading belong in `@unterberg/nivel`; brand logo and favicons remain consumer-owned assets in `packages/consumer-dev`.
- Navbar and sidebar behavior must be driven by the unified docs graph, not by separate manual navigation files.
- Code style rule: use arrow functions only. Do not introduce `function` declarations in repo code.
- Migrated MDX/content must be passed through the repo formatter after import and path rewrites; do not copy legacy content over unformatted.
- Finish workspace changes by running `pnpm format`, `pnpm typecheck`, and `pnpm knip`. Keep `pnpm build` required for structural or runtime changes.
