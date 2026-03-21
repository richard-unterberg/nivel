// https://vike.dev/Head
import appConfig from '@/lib/config'

export function Head() {
  return <link rel="icon" href={`${appConfig.publicAssets}favicon.svg`} />
}
