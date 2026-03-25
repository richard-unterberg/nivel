import { Hammer, SwatchBook, Zap } from 'lucide-react'
import { usePageContext } from 'vike-react/usePageContext'
import { t } from '@/lib/messages'

const usps = [
  {
    title: 'uspDesignSytemTitle',
    description: 'uspDesignSystemDescription',
    icon: SwatchBook,
  },
  {
    title: 'uspVikePoweredTitle',
    description: 'uspVikePoweredDescription',
    icon: Hammer,
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
    <div className="grid md:grid-cols-3 gap-4 mt-16">
      {usps.map((usp) => {
        const Icon = usp.icon

        return (
          <div
            key={usp.title}
            className="prose max-w-none prose-h2:mt-0 prose-h2:mb-0 flex flex-col p-4 rounded-box border border-vike-grey bg-base-200"
          >
            <div className="flex gap-2 items-start">
              <h2 className="text-lg font-semibold flex-1">{t(locale, 'landing', usp.title)}</h2>
              <Icon className="w-4 h-4 translate-y-1 mb-4 text-accent" />
            </div>
            <p className="text-sm">{t(locale, 'landing', usp.description)}</p>
          </div>
        )
      })}
    </div>
  )
}

export default UspSection
