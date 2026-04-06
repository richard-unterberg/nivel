import type { ResolvedDocsHeadConfig } from '../../../../docs/types.js'

export const FontLinks = ({ head }: { head: ResolvedDocsHeadConfig }) => {
  const { fontStylesheetHref, fontPreloadHrefs } = head
  const effectivePreloadHrefs = fontPreloadHrefs ?? []

  return (
    <>
      {effectivePreloadHrefs.map((href) => (
        <link key={href} rel="preload" href={href} as="font" type="font/woff2" crossOrigin="anonymous" />
      ))}
      {fontStylesheetHref && <link rel="stylesheet" href={fontStylesheetHref} />}
    </>
  )
}
