export { renderMermaidSvg }

let isMermaidInitialized = false
let mermaidModulePromise: Promise<typeof import('mermaid').default> | null = null

const loadMermaid = async () => {
  mermaidModulePromise ??= import('mermaid').then((module) => module.default)
  return mermaidModulePromise
}

const ensureMermaidInitialized = async () => {
  const mermaid = await loadMermaid()

  if (isMermaidInitialized) {
    return mermaid
  }

  mermaid.initialize({
    startOnLoad: false,
    suppressErrorRendering: true,
    theme: 'base',
  })
  isMermaidInitialized = true

  return mermaid
}

const renderMermaidSvg = async (diagramId: string, source: string) => {
  const mermaid = await ensureMermaidInitialized()
  const { svg } = await mermaid.render(diagramId, source)
  return svg
}
