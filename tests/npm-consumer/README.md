# npm consumer fixture

Thin local e2e consumer for manually testing the published `@unterberg/nivel` package from npm.

This fixture is intentionally outside the pnpm workspace package globs, so it exercises the package as a standalone consumer instead of relying on workspace linking.

Because the published `0.0.2` package does not yet ship the `nivel` CLI or build-time asset emission, this fixture keeps two tiny local scripts:
- `scripts/generateDocsPages.ts` calls the published `@unterberg/nivel/runtime/node` API.
- `scripts/syncNivelAssets.ts` copies engine-owned assets from the installed npm package after build.

## Usage

```bash
cd tests/npm-consumer
npm install
npm run dev
```

Build and typecheck:

```bash
npm run build
npm run typecheck
```
