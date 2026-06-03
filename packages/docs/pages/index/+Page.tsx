import { LayoutComponent } from '@unterberg/nivel/client'
import './startpage.css'
import cm from '@classmatejs/react'
import { Calculator, CirclePile, Hammer, type LucideIcon, Smile } from 'lucide-react'

const kpis = [
  {
    title: 'Structure-first',
    description: 'Model sections, groups and pages in one typed structure.',
    ctaHref: '/docs/structure',
    ctaText: 'Learn more',
    icon: CirclePile,
  },
  {
    title: 'Deterministic resolver',
    description: 'Generate routes, aliases, navigation, metadata and layout data.',
    ctaHref: '/docs/resolvers',
    ctaText: 'Learn more',
    icon: Calculator,
  },
  {
    title: 'Vike-powered output',
    description: 'Use generated Vike pages inside your own React shell.',
    ctaHref: '/docs/vike',
    ctaText: 'Learn more',
    icon: Hammer,
  },
]

const KpiCard = ({
  title,
  description,
  ctaHref,
  ctaText,
  icon,
}: {
  title: string
  description: string
  ctaHref: string
  ctaText: string
  icon: LucideIcon
}) => {
  const Icon = icon

  return (
    <div className="card card-border border-base-muted-light lg:card-lg bg-base-100 dark:bg-base-muted-superlight overflow-hidden">
      <div className="card-body py-6 md:py-8 px-6 items-center text-center flex gap-2 md:gap-4">
        <div className="card-title">
          <div className="rounded-full size-7 bg-base-muted-superlight pointer-events-none flex justify-center items-center">
            <Icon className="size-4 text-primary" />
          </div>
          <h2>{title}</h2>
        </div>
        <p className="text-base-muted">{description}</p>
      </div>
    </div>
  )
}

const GradientTop = cm.div`
  absolute 
  min-w-300 
  left-1/2 w-full h-svh 
  bg-radial-[at_50%_30%] 
  to-primary-muted-light/70
  to-85%
  dark:from-primary-muted-light/40
  dark:to-transparent
  dark:bg-radial-[at_50%_10%]
  dark:to-35%
  lg:dark:to-55%
  translate-x-[-50%] 
  pointer-events-none
`

const Page = () => {
  return (
    <div className="relative">
      <div className="absolute -top-px h-px w-full left-0 bg-base-muted-light pointer-events-none z-100" />
      <div className="overflow-x-clip min-h-[calc(100svh-14*var(--spacing))] flex flex-col w-full">
        <div className="flex-1 py-16 flex flex-col items-center justify-center">
          <div className="w-full overflow-hidden h-full max-w-full absolute top-0 left-0">
            <GradientTop />
          </div>
          <LayoutComponent $size="xs" className="text-center mx-auto z-2 relative mb-12">
            <p className="text-primary uppercase font-medium tracking-wide mb-4">Explore nivel</p>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 md:mb-10 w-4/5 sm:w-3/4 mx-auto">
              Structure-first docs for React developers
            </h1>
            <p className="text-base-muted text-lg md:text-xl lg:text-2xl mt-4">
              Define your docs once. Nivel resolves routes, navigation, MDX runtime and layout context for a
              Vike-powered React app.
            </p>
          </LayoutComponent>
          <LayoutComponent $size="sm">
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {kpis.map((kpi) => (
                <KpiCard key={kpi.title} {...kpi} />
              ))}
            </div>
            <div className="flex items-center justify-center gap-4 w-full">
              <a href="/docs" className="btn btn-primary mt-16">
                Explore the docs
              </a>
              <a href="/docs" className="btn btn-primary btn-outline mt-16">
                Quick start guide
              </a>
            </div>
          </LayoutComponent>
        </div>
        <p className="text-center text-sm text-base-muted mt-12 mb-4 flex items-center justify-center gap-1">
          <Smile className="size-4" /> 2026, Richard Unterberg
        </p>
      </div>
    </div>
  )
}

export default Page
