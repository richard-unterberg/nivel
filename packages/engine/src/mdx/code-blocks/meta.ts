const kebabCase = (value: string) => {
  return value
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replaceAll('_', '-')
    .toLowerCase()
}

type ParsedMeta<Name extends string = string> = {
  props: Partial<Record<Name, string>>
  rest: string
  tokens: ParsedMetaToken[]
}

type ParsedMetaToken = {
  hasExplicitValue: boolean
  name: string
  raw: string
  value?: string
}

const KEY_VALUE_PAIR_RE = /(?<name>[a-zA-Z_-]+)(?:=([^"'\s]+))?/g
const RESERVED_CODE_BLOCK_META_NAMES = new Set([
  'choice',
  'file-added',
  'file-removed',
  'hide-menu',
  'max-width',
  'ts-only',
])

export const parseMetaString = <Name extends string = string>(meta: unknown, propNames?: Name[]): ParsedMeta<Name> => {
  if (typeof meta !== 'string' || meta.trim() === '') {
    return { props: {}, rest: '', tokens: [] }
  }

  const props: ParsedMeta['props'] = {}
  const tokens: ParsedMetaToken[] = []
  const rest = meta.replaceAll(KEY_VALUE_PAIR_RE, (match, name: string, value: string | undefined) => {
    const normalizedName = kebabCase(name)
    tokens.push({
      hasExplicitValue: value !== undefined,
      name: normalizedName,
      raw: match,
      value,
    })

    if (propNames && !propNames.includes(normalizedName as Name)) {
      return match
    }

    props[normalizedName] = value || 'true'
    return ''
  })

  return {
    props,
    rest: rest.trim(),
    tokens,
  }
}

export const getCodeBlockPropsFromMeta = (meta: unknown) => {
  const parsed = parseMetaString(meta)
  const props = { ...parsed.props } as Record<string, string>
  const implicitTitleToken = parsed.tokens.find(
    (token) => !token.hasExplicitValue && !RESERVED_CODE_BLOCK_META_NAMES.has(token.name),
  )
  const explicitTitle = typeof props.title === 'string' && props.title.trim() ? props.title.trim() : null

  delete props.title
  if (implicitTitleToken) {
    delete props[implicitTitleToken.name]
  }

  return {
    props,
    title: explicitTitle ?? implicitTitleToken?.raw.trim() ?? null,
  }
}
