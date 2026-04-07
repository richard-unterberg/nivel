# npm consumer fixture

Thin local e2e consumer for manually testing the published `@unterberg/nivel` package from npm.

This fixture is intentionally outside the pnpm workspace package globs, so it exercises the package as a standalone consumer instead of relying on workspace linking.

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
