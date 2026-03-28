import Favicon from '@/components/MetaHead/Favicon'
import MetaHeadFonts from '@/components/MetaHead/Fonts'
import ThemeBootstrap from '@/components/MetaHead/ThemeBootstrap'

const MetaHead = () => {
  return (
    <>
      <ThemeBootstrap />
      <Favicon />
      <MetaHeadFonts />
    </>
  )
}

export default MetaHead
