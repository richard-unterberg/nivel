export { CustomIntegrationWarning }

import { Link } from '@/components/Link'
import { Advanced } from '@/components/Note'
import { UiFrameworkExtension, type UiFrameworkExtensionList } from '@/components/UiFrameworkExtension'

function CustomIntegrationWarning({ uiFramework }: { uiFramework?: 'react' | 'vue' | 'solid' }) {
  const list: UiFrameworkExtensionList | undefined = uiFramework && [`vike-${uiFramework}`]
  const uiFrameworkExtension = !list ? (
    <UiFrameworkExtension succinct />
  ) : (
    <UiFrameworkExtension name noLink list={list} />
  )

  return (
    <Advanced>
      <p>Custom integrations can be complex and we generally recommend using {uiFrameworkExtension} instead.</p>
      <p className="flex gap-2">
        <span style={{ fontFamily: 'emoji' }}>👉</span> A custom integration can make sense in following scenarios:
      </p>
      <ul>
        <li>
          <p>You are building an app with a simple architecture.</p>
          <blockquote>
            <p>
              For example <code>https://vike.dev</code> has a simple architecture — it uses a custom integration.
            </p>
            <p>
              You can read the source code of {uiFrameworkExtension} — it's small! — and check whether you need most of
              the code. If you do then it probably makes sense to use {uiFrameworkExtension}.
            </p>
          </blockquote>
        </li>
        <li>
          <p>You are using {uiFrameworkExtension} but ran into a blocker.</p>
          <blockquote>
            Before migrating away from {uiFrameworkExtension}, we recommend talking with Vike maintainers to explore
            your options.
          </blockquote>
        </li>
      </ul>
      <p>
        See also: <Link href="/extension-vs-custom" />.
      </p>
    </Advanced>
  )
}
