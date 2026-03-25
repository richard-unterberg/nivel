import { getPrerenderDocUrls } from '@/lib/docs/content'
import mdex from '@/pages/+mdex'

const onBeforePrerenderStart = () => {
  return getPrerenderDocUrls(mdex)
}

export default onBeforePrerenderStart
