import { LayoutComponent } from '@unterberg/nivel/client'
import './startpage.css'

const Page = () => {
  return (
    <div>
      <div className="overflow-x-clip min-h-[calc(100svh-14*var(--spacing))] flex flex-col justify-center py-16 w-full">
        <div className="w-full overflow-x-hidden h-full max-w-full absolute top-0 left-0">
          <div className="absolute top-0 min-w-300 left-1/2 w-full h-svh bg-radial-[at_50%_50%] from-primary-muted-light/30 dark:from-primary-muted-light/30 to-55% translate-x-[-50%] pointer-events-none" />
        </div>

        <LayoutComponent $size="xs" className="relative">
          <div className="text-center mx-auto z-2 relative">
            <div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl! font-bold tracking-tight mb-12">
                Docs for developers
              </h1>
              <p className="font-normal text-base-muted text-lg md:text-2xl lg:text-3xl mt-4">
                Nivel is a structure-first documentation engine for developers who need more than markdown files and a
                sidebar.
              </p>
            </div>
          </div>
        </LayoutComponent>
      </div>
    </div>
  )
}

export default Page
