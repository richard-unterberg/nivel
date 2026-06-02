import cm from '@classmatejs/react'
import { baseAssets } from '@unterberg/nivel'
import { ProseContainer } from '@unterberg/nivel/client'

const FeatureProse = cm.extend(ProseContainer)`
  prose-headings:my-0 
  prose-p:my-0 
  prose-headings:mb-4 
  prose-img:my-0
  mb-8
`

const FeatureHeading = cm.h3`
  flex items-center 
  gap-x-3
`

const FeatureBox = cm.div`
  bg-base-200
  p-3 lg:p-6 
  rounded-box
  prose-headings:text-xl
  border-base-muted-light
  border
`

export const Features = () => {
  return (
    <FeatureProse>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 m-auto max-w-none">
        <FeatureBox>
          <FeatureHeading>
            <span className="h-fit">
              <img src={`${baseAssets}brands/typescript.svg`} alt="TypeScript" className="size-5" />
              <span className="sr-only">TypeScript</span>
            </span>
            Type-Safe by definition
          </FeatureHeading>
          <p>
            Telefunc <b>automatically generates runtime shields</b> from argument types. Inference and autocompletion
            are default.
          </p>
        </FeatureBox>
        <FeatureBox>
          <FeatureHeading>
            <span>💎</span> Schemaless by design
          </FeatureHeading>
          <p>
            <b>The types are the contract.</b> Just import and call telefunctions like any other function. Telefunc does
            the rest.
          </p>
        </FeatureBox>
        <FeatureBox>
          <FeatureHeading>
            <span>💫</span> Full-stack development
          </FeatureHeading>
          <p>
            Iterate flexibly and rapidly. <b>Add telefunctions as you go,</b> instead of getting bogged down with a
            back-end API schema.
          </p>
        </FeatureBox>
        <FeatureBox>
          <FeatureHeading>
            <span>⚡</span> Minimal footprint
          </FeatureHeading>
          <p>
            Telefunc isn't just small, it lets you write small. <b>Send only the data you need</b> for optimal
            performance and security.
          </p>
        </FeatureBox>
        <FeatureBox>
          <FeatureHeading>
            <span>🛡️</span> Separation of concerns
          </FeatureHeading>
          <p>
            <b>Couple code, not environments.</b> Telefunctions let you call server-side tools like databases or
            third-party clients without worrying about the boilerplate.
          </p>
        </FeatureBox>
        <FeatureBox>
          <FeatureHeading>
            <span>🔌</span> Framework agnostic
          </FeatureHeading>
          <p>
            It works out-of-box with <b>Next.js, Nuxt, SvelteKit, Vike, and React Native</b>, as well as bundlers like
            Vite, Webpack, Babel, or Parcel.
          </p>
        </FeatureBox>
      </div>
    </FeatureProse>
  )
}
