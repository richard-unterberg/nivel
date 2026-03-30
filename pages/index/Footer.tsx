import { usePageContext } from 'vike-react/usePageContext'
import ProseContainer from '@/components/app/ProseContainer'
import { Link } from '@/components/index'
import { headingDefinitions } from '@/lib/headings'
import { t } from '@/lib/messages'

const StartPageFooter = () => {
  const { locale } = usePageContext()

  return (
    <ProseContainer>
      <div className="flex flex-col">
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
    </ProseContainer>
  )
}

export default StartPageFooter
