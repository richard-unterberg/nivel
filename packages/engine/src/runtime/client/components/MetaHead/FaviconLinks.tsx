import type { ResolvedDocsHeadConfig } from '../../../../docs/types.js'

export const FaviconLinks = ({ head }: { head: ResolvedDocsHeadConfig }) => {
  const { appleTouchIcon, faviconIco, faviconSvg } = head

  return (
    <>
      {appleTouchIcon && <link rel="apple-touch-icon" href={appleTouchIcon} />}
      {faviconSvg && <link rel="icon" type="image/svg+xml" href={faviconSvg} />}
      {faviconIco && (
        <>
          <link rel="shortcut icon" type="image/x-icon" href={faviconIco} />
          <link rel="icon" type="image/x-icon" href={faviconIco} />
        </>
      )}
    </>
  )
}
