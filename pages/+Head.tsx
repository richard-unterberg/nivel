// https://vike.dev/Head

import { createEffect, createMemo } from 'solid-js'
import { PageContext } from 'vike/types'
import { usePageContext } from 'vike-solid/usePageContext'
import appConfig from '@/lib/config'

export const Head = () => {
  const context = usePageContext()
  const locale = createMemo(() => context.locale || 'en')
  const isChinese = locale() === 'zh'

  return (
    <>
      <link rel="icon" href={`${appConfig.publicAssets}favicon.svg`} />
      {isChinese ? (
        <>
          <link
            rel="preload"
            href={`${appConfig.publicAssets}fonts/noto-sans-sc-v40-chinese-simplified-regular.woff2`}
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href={`${appConfig.publicAssets}fonts/noto-sans-sc-v40-chinese-simplified-600.woff2`}
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href={`${appConfig.publicAssets}fonts/noto-sans-sc-v40-chinese-simplified-800.woff2`}
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        </>
      ) : (
        <>
          <link
            rel="preload"
            href={`${appConfig.publicAssets}fonts/inter-v20-latin-regular.woff2`}
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href={`${appConfig.publicAssets}fonts/inter-v20-latin-600.woff2`}
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href={`${appConfig.publicAssets}fonts/inter-v20-latin-800.woff2`}
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        </>
      )}
      <link
        rel="stylesheet"
        href={`${appConfig.publicAssets}${isChinese ? 'fonts-noto-sans-sc.css' : 'fonts-inter.css'}`}
      />
    </>
  )
}
