export { parseMetaString }

const kebabCase = (value: string) => {
  return value
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replaceAll('_', '-')
    .toLowerCase()
}

type ParsedMeta<Name extends string = string> = {
  props: Partial<Record<Name, string>>
  rest: string
}

const KEY_VALUE_PAIR_RE = /(?<name>[a-zA-Z_-]+)(?:=([^"'\s]+))?/g

function parseMetaString<Name extends string = string>(meta: unknown, propNames?: Name[]): ParsedMeta<Name> {
  if (typeof meta !== 'string' || meta.trim() === '') {
    return { props: {}, rest: '' }
  }

  const props: ParsedMeta['props'] = {}
  const rest = meta.replaceAll(KEY_VALUE_PAIR_RE, (match, name: string, value: string | undefined) => {
    const normalizedName = kebabCase(name)

    if (propNames && !propNames.includes(normalizedName as Name)) {
      return match
    }

    props[normalizedName] = value || 'true'
    return ''
  })

  return {
    props,
    rest: rest.trim(),
  }
}
