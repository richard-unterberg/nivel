import { usePageContext } from 'vike-react/usePageContext'
import baseAssets from '@/lib/baseAssets'

const MetaHeadFonts = () => {
  const { locale } = usePageContext()
  const isChinese = locale === 'zh'

  return (
    <>
      {isChinese ? (
        <>
          <link
            rel="preload"
            href={`${baseAssets}fonts/noto-sans-sc-v40-chinese-simplified-regular.woff2`}
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href={`${baseAssets}fonts/noto-sans-sc-v40-chinese-simplified-600.woff2`}
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href={`${baseAssets}fonts/noto-sans-sc-v40-chinese-simplified-800.woff2`}
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        </>
      ) : (
        <>
          <link
            rel="preload"
            href={`${baseAssets}fonts/inter-v20-latin-regular.woff2`}
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href={`${baseAssets}fonts/inter-v20-latin-600.woff2`}
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href={`${baseAssets}fonts/inter-v20-latin-800.woff2`}
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        </>
      )}
      <link rel="stylesheet" href={`${baseAssets}${isChinese ? 'fonts-noto-sans-sc.css' : 'fonts-inter.css'}`} />
    </>
  )
}

export default MetaHeadFonts
