import { usePageContext } from 'vike-react/usePageContext'
import Link from '@/components/docs/Link'
import { headingDefinitions } from '@/lib/headings'
import { t } from '@/lib/messages'
import DefineTelefunctionSnippet from './DefineTelefunctionSnippet.mdx'
import ServerSetupSnippet from './ServerSetupSnippet.mdx'
import SimpleQuerySnippet from './SimpleQuerySnippet.mdx'

export const Quickstart = () => {
  const { locale } = usePageContext()

  return (
    <div className="flex flex-col">
      <div className="flex p-2 mb-12">
        <div>
          <NumberedHeading index={1} label="Define your telefunction" />
          <p>Telefunctions are slim server functions that are scoped to UI events or interactions.</p>
          <p>
            To invoke them remotely, Telefunc wraps front-end calls with a lightweight HTTP client that handles the
            request boilerplate. Server-side, Telefunc middleware intercepts the call and runs our function.
          </p>
          <p>
            Telefunc automatically generates a runtime **shield** from your argument types, so we don't need to worry
            about validation. In this example, we just need to check user permissions, then run our SQL.
          </p>
          <p>
            Since our telefunction is scoped to a specific event, we only need to return the data our UI needs (in this
            case, nothing).
          </p>
        </div>
        <div>
          <DefineTelefunctionSnippet />
        </div>
      </div>
      <div className="flex p-2 mb-12">
        <div>
          <NumberedHeading index={2} label="Add to your server" />
          <p className="leading-8">
            Telefunc is built on Web Standards, and works out-of-box with any <code>Request</code>- or Node.js-
            <code>req</code>-compatible server.
          </p>
          <p className="leading-8">
            This includes metaframeworks like Next.js, Nuxt, or Vike, backend servers like Hono or Express, and bundlers
            or frameworks like Vite or Cloudflare Workers. We simply add middleware at <code>/_telefunc</code> to adapt
            the request and response as needed.
          </p>
          <p className="leading-8">
            This is also our opportunity to populate the Telefunc <code>Context</code>, e.g., with <em>required</em>{' '}
            server request context.&nbsp;
            <b>Remember, Telefunc is all about keeping things small: security and performance through omission.</b>
          </p>
          <p className="leading-8">
            The Telefunc middleware supports standard JSON and <code>File</code> data, and&nbsp;
            <a href="https://github.com/telefunc/telefunc/pull/236" className="font-bold">
              streaming is coming soon.
            </a>
          </p>
        </div>
        <div>
          <ServerSetupSnippet />
        </div>
      </div>
      <div style={{ display: 'flex', padding: 8, columnGap: 48 }}>
        <div>
          <NumberedHeading index={3} label="Start querying" />
          <p className="leading-8">
            With Telefunc added to our server, we just need to import and call our telefunction!
          </p>
          <p className="leading-8">
            By defining telefunctions in a <code>*.telefunc.ts</code> file next to the component that calls them, we get
            type inference and autocompletion for free.
          </p>
          <p className="leading-8">
            Likewise, naming telefunctions <code>onSomeEvent</code> is an easy wasy to prevent scope keep. That way our
            app is more secure and performant by design.
          </p>
        </div>
        <div>
          <SimpleQuerySnippet />
        </div>
      </div>
      <div className="flex flex-col">
        <h2 className="text-xl lg:text-2xl xl:text-3xl font-semibold mb-4">You may not need an API schema</h2>
        <figure className="w-full mt-6 border-l-2 pl-6 italic self-center">
          <blockquote>Premature optimization is the root of all evil.</blockquote>
          <figcaption className="flex justify-end">
            <small>
              <em>Turing Award winner, Donal Knuth</em>
            </small>
          </figcaption>
        </figure>
        <div className="leading-8 mt-10">
          <p>
            Telefunc enables you to stay lean, iterating faster and pivoting more flexibly. Many apps will never need a
            public (or schema-full) API, but if that changes, adopting REST or GraphQL is fairly straightforward.
            Telefunctions are just functions.
          </p>
          <p>
            If your goal is to enable third party developers to access your data, then you need a generic API and you'll
            have to use REST or GraphQL.
          </p>
          <p>
            But but if your goal is to seamlessly add data and interactivity to a front-end, then Telefunc can improve
            DX and enable security and performance optimizations.
          </p>
        </div>
      </div>
      <div className="flex justify-center gap-x-5 mx-9 mb-20">
        <Link href={`/${headingDefinitions.quickStart.docPath}`} className="btn btn-secondary btn-lg">
          {t(locale, 'landing', 'getStartedButton')}
        </Link>
        <Link
          href={`/${headingDefinitions.whySchemaless.docPath}`}
          className="btn btn-ghost border-base-content bg-transparent btn-lg"
        >
          {t(locale, 'landing', 'learnMoreButton')}
        </Link>
      </div>
    </div>
  )
}

function NumberedHeading({ index, label }: { index: number; label: string }) {
  return (
    <div className="flex items-center mb-2">
      <div className="w-9 h-9 m-1 mr-4 px-2 py-1.5 rounded-full text-center font-bold float-left bg-primary text-primary-content">
        {index}
      </div>
      <h2 className="flex items-center gap-x-1 text-xl lg:text-2xl xl:text-3xl font-semibold m-0">{label}</h2>
    </div>
  )
}
