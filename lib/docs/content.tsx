import type { Component } from 'solid-js'
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/lib/i18n/config'

type MdxModule = {
  default: Component
}

type DocEntry = Partial<Record<Locale, Component>>

const modules = import.meta.glob<MdxModule>('../../pages/**/content.*.mdx', {
  eager: true,
})

const docs = Object.entries(modules).reduce<Record<string, DocEntry>>((acc, [path, mod]) => {
  const match = path.match(/\/pages\/\(docs\)\/(.+)\/content\.([^.]+)\.mdx$/)
  if (!match) return acc

  const [, routeId, locale] = match
  if (!isLocale(locale)) return acc

  acc[routeId] ??= {}
  acc[routeId][locale] = mod.default
  return acc
}, {})

export const getDocPage = (slug: string, locale: Locale) => {
  const doc = docs[slug]
  if (!doc) return null

  const Page = doc[locale] ?? doc[DEFAULT_LOCALE]
  if (!Page) return null

  return {
    Page,
    resolvedLocale: doc[locale] ? locale : DEFAULT_LOCALE,
  }
}
