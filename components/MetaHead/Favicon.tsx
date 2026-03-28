import baseAssets from '@/lib/baseAssets'

const Favicon = () => {
  return (
    <>
      <link rel="apple-touch-icon" sizes="57x57" href={`${baseAssets}favicons/favicon-57x57.png`} />
      <link rel="apple-touch-icon" sizes="60x60" href={`${baseAssets}favicons/favicon-60x60.png`} />
      <link rel="apple-touch-icon" sizes="72x72" href={`${baseAssets}favicons/favicon-72x72.png`} />
      <link rel="apple-touch-icon" sizes="76x76" href={`${baseAssets}favicons/favicon-76x76.png`} />
      <link rel="apple-touch-icon" sizes="114x114" href={`${baseAssets}favicons/favicon-114x114.png`} />
      <link rel="apple-touch-icon" sizes="120x120" href={`${baseAssets}favicons/favicon-120x120.png`} />
      <link rel="apple-touch-icon" sizes="144x144" href={`${baseAssets}favicons/favicon-144x144.png`} />
      <link rel="apple-touch-icon" sizes="152x152" href={`${baseAssets}favicons/favicon-152x152.png`} />
      <link rel="apple-touch-icon" sizes="180x180" href={`${baseAssets}favicons/favicon-180x180.png`} />
      <link rel="icon" type="image/svg+xml" href={`${baseAssets}favicons/favicon.svg`} />
      <link rel="icon" type="image/png" sizes="16x16" href={`${baseAssets}favicons/favicon-16x16.png`} />
      <link rel="icon" type="image/png" sizes="32x32" href={`${baseAssets}favicons/favicon-32x32.png`} />
      <link rel="icon" type="image/png" sizes="96x96" href={`${baseAssets}favicons/favicon-96x96.png`} />
      <link rel="icon" type="image/png" sizes="192x192" href={`${baseAssets}favicons/favicon-192x192.png`} />
      <link rel="shortcut icon" type="image/x-icon" href={`${baseAssets}favicons/favicon.ico`} />
      <link rel="icon" type="image/x-icon" href={`${baseAssets}favicons/favicon.ico`} />
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta name="msapplication-TileImage" content={`${baseAssets}favicons/favicon-144x144.png`} />
      <meta name="msapplication-config" content={`${baseAssets}favicons/browserconfig.xml`} />
    </>
  )
}

export default Favicon
