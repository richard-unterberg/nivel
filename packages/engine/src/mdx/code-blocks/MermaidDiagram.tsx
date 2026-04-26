export { MermaidDiagram }

import { cmMerge } from '@classmatejs/react'
import mermaid from 'mermaid'
import { useEffect, useId, useState } from 'react'

let isMermaidInitialized = false

const ensureMermaidInitialized = () => {
  if (isMermaidInitialized) {
    return
  }

  mermaid.initialize({
    startOnLoad: false,
    suppressErrorRendering: true,
  })
  isMermaidInitialized = true
}

const MermaidDiagram = ({ className, source }: { className?: string; source: string }) => {
  const [svg, setSvg] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const diagramId = useId()

  useEffect(() => {
    let isActive = true

    const renderDiagram = async () => {
      try {
        ensureMermaidInitialized()
        const { svg: renderedSvg } = await mermaid.render(`nivel-mermaid-${diagramId}`, source)

        if (!isActive) {
          return
        }

        setSvg(renderedSvg)
        setError(null)
      } catch (renderError) {
        if (!isActive) {
          return
        }

        const message = renderError instanceof Error ? renderError.message : 'Failed to render Mermaid diagram.'
        setError(message)
        setSvg(null)
      }
    }

    void renderDiagram()

    return () => {
      isActive = false
    }
  }, [diagramId, source])

  if (error) {
    return (
      <div className={cmMerge('space-y-3', className)} data-mermaid-diagram="" data-mermaid-status="error">
        <div className="rounded-box border border-error/30 bg-error/8 px-4 py-3 text-sm text-error">{error}</div>
        <pre className="doc-code-pre m-0 overflow-x-auto bg-base-200! p-4 text-sm">
          <code>{source}</code>
        </pre>
      </div>
    )
  }

  if (!svg) {
    return (
      <div className={cmMerge('space-y-3', className)} data-mermaid-diagram="" data-mermaid-status="loading">
        <div className="rounded-box border border-base-muted-light bg-base-muted-superlight/70 px-4 py-10 text-center text-sm text-base-content/70">
          Rendering diagram...
        </div>
        <pre className="doc-code-pre m-0 overflow-x-auto bg-base-200! p-4 text-sm">
          <code>{source}</code>
        </pre>
      </div>
    )
  }

  return (
    <div
      className={cmMerge(
        'overflow-x-auto bg-base-200 px-3 py-4 [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full',
        className,
      )}
      data-mermaid-diagram=""
      data-mermaid-status="ready"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
