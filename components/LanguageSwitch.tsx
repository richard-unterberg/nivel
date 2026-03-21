import Languages from 'lucide-solid/icons/languages'
import { createMemo, For } from 'solid-js'
import { navigate } from 'vike/client/router'
import { usePageContext } from 'vike-solid/usePageContext'
import { localeLabels, locales } from '@/lib/i18n/config'
import { getLogicalPathname, localizeHref, stripLocaleFromPathname } from '@/lib/i18n/routing'

const LanguageSwitch = () => {
  const pageContext = usePageContext()
  const currentLocalizedPathname = createMemo(() => pageContext.urlPathnameLocalized ?? pageContext.urlPathname)
  const logicalPathname = createMemo(() => getLogicalPathname(currentLocalizedPathname()))
  const currentLocale = createMemo(() => stripLocaleFromPathname(currentLocalizedPathname()).locale)

  const onChange = async (event: Event) => {
    const select = event.target as HTMLSelectElement
    const selectedLocale = select.value as (typeof locales)[number]
    const newHref = localizeHref(logicalPathname(), selectedLocale)

    if (newHref === currentLocalizedPathname()) return
    // await navigate(newHref, { pageContext: { clientRouting: false } })

    // do full reload to ensure the new locale is properly loaded, including all translations and locale-specific data
    window.location.href = newHref
  }

  return (
    <label class="select select-sm">
      <span class="label">
        <Languages class="w-3 h-3" />
      </span>
      <select value={currentLocale()} onChange={(event) => void onChange(event)} aria-label="Switch language">
        <For each={locales}>
          {(locale) => (
            <option value={locale} selected={currentLocale() === locale}>
              {localeLabels[locale]}
            </option>
          )}
        </For>
      </select>
    </label>
  )
}

export default LanguageSwitch
