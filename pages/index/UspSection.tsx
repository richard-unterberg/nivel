import cm from '@classmatejs/react'
import { Hammer, SwatchBook, Zap } from 'lucide-react'
import { usePageContext } from 'vike-react/usePageContext'
import { t } from '@/lib/messages'

const usps = [
  {
    title: 'uspVikePoweredTitle',
    description: 'uspVikePoweredDescription',
    icon: Hammer,
  },
  {
    title: 'uspDesignSytemTitle',
    description: 'uspDesignSystemDescription',
    icon: SwatchBook,
  },
  {
    title: 'uspDeveloperExperienceTitle',
    description: 'uspDeveloperExperienceDescription',
    icon: Zap,
  },
] as const

const UspSection = () => {
  const { locale } = usePageContext()

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {usps.map((usp) => {
        const Icon = usp.icon

        return (
          <StyledLink key={usp.title} href="#features">
            <span className="flex gap-2 items-start mb-3">
              <h2 className="text-lg font-semibold flex-1">{t(locale, 'landing', usp.title)}</h2>
              <Icon className="w-4 h-4 translate-y-1 mb-4 text-primary" />
            </span>
            <span className="text-sm">{t(locale, 'landing', usp.description)}</span>
          </StyledLink>
        )
      })}
    </div>
  )
}

export default UspSection

const StyledLink = cm.a`
  block
  prose max-w-none prose-h2:mt-0 prose-h2:mb-0 
  flex flex-col p-4 
  rounded-box 
  border border-base-light
  bg-base-200/40 dark:bg-base-200/60
  transition-colors duration-200
  shadow-lg
  shadow-base-100
  hover:shadow-primary/30
  hover:border-primary/50
`
