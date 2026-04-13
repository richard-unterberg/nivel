## nivel ✨

static site builder for mdx documentations - alpha

⚠️ This project is under development and built in mind to mainly support vike & telefunc documentation pages.
Expect breaking changes on engine updates.

### [`packages/engine`](packages/engine)

Main reusable package that exports the core engine and public helpers for consumer use. The engine is framework-agnostic and can be used in any React-based setup, but we currently only export a Vike config helper for convenience.

### [`packages/consumer-dev`](packages/consumer-dev)

In-repo consumer that exercises the engine against real docs content. This is the main playground for development and testing. It also serves as a reference implementation for consumers.

### [`tests/npm-consumer`](tests/npm-consumer)

Standalone npm fixture that installs the published package outside the workspace and validates the consumer contract from a real package install. This is the final gatekeeper for ensuring we don't accidentally break consumers with changes to the engine.
