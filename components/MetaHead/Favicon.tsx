import baseAssets from '@/lib/baseAssets'

const Favicon = () => {
  return (
    <>
      <link rel="apple-touch-icon" sizes="57x57" href={`${baseAssets}favicon/favicon-57x57.png`} />
      <link rel="apple-touch-icon" sizes="60x60" href={`${baseAssets}favicon/favicon-60x60.png`} />
      <link rel="apple-touch-icon" sizes="72x72" href={`${baseAssets}favicon/favicon-72x72.png`} />
      <link rel="apple-touch-icon" sizes="76x76" href={`${baseAssets}favicon/favicon-76x76.png`} />
      <link rel="apple-touch-icon" sizes="114x114" href={`${baseAssets}favicon/favicon-114x114.png`} />
      <link rel="apple-touch-icon" sizes="120x120" href={`${baseAssets}favicon/favicon-120x120.png`} />
      <link rel="apple-touch-icon" sizes="144x144" href={`${baseAssets}favicon/favicon-144x144.png`} />
      <link rel="apple-touch-icon" sizes="152x152" href={`${baseAssets}favicon/favicon-152x152.png`} />
      <link rel="apple-touch-icon" sizes="180x180" href={`${baseAssets}favicon/favicon-180x180.png`} />
      <link rel="icon" type="image/svg+xml" href={`${baseAssets}favicon/favicon.svg`} />
      <link rel="icon" type="image/png" sizes="16x16" href={`${baseAssets}favicon/favicon-16x16.png`} />
      <link rel="icon" type="image/png" sizes="32x32" href={`${baseAssets}favicon/favicon-32x32.png`} />
      <link rel="icon" type="image/png" sizes="96x96" href={`${baseAssets}favicon/favicon-96x96.png`} />
      <link rel="icon" type="image/png" sizes="192x192" href={`${baseAssets}favicon/favicon-192x192.png`} />
      <link rel="shortcut icon" type="image/x-icon" href={`${baseAssets}favicon/favicon.ico`} />
      <link rel="icon" type="image/x-icon" href={`${baseAssets}favicon/favicon.ico`} />
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta name="msapplication-TileImage" content={`${baseAssets}favicon/favicon-144x144.png`} />
      <meta name="msapplication-config" content={`${baseAssets}favicon/browserconfig.xml`} />
    </>
  )
}

export default Favicon
