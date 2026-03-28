import { getPrerenderDocUrls } from '@/lib/docs/content'
import telefunc from '@/pages/+telefunc'

const onBeforePrerenderStart = () => {
  return getPrerenderDocUrls(telefunc)
}

export default onBeforePrerenderStart
