# @unterberg/universal-mdx-mods

Reusable MDX-facing React components extracted from the Telefunc docs app.

## Scope

- Presentation-first components that can be reused across Vike apps.
- No bundled Tailwind or DaisyUI setup; the host app remains responsible for styling tokens.
- No direct dependency on Vike page context. Runtime-aware integrations should flow through the shared adapter contract.

## Current Exports

- `Alert`
- `ChoiceGroup`
- `CodeBlockTransformer`
- `code-blocks` build-time entrypoint for remark/rehype/Shiki code-block tooling
- `FileAdded`
- `FileRemoved`
- `Link`
- `Pre`
- `Table`
- `RepoLink`
- `UniversalMdxProvider`
- `useUniversalMdxRuntime`
- runtime contract types for future context-aware components, including code-block choice persistence and host-provided doc-link resolution
