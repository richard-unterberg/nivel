const kebabCase = (value: string) => {
  return value
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replaceAll('_', '-')
    .toLowerCase()
}

const CODE_BLOCK_HEADER_ENVIRONMENTS = ['client', 'server'] as const
const CODE_BLOCK_PRE_PROP_NAMES = ['data-language-label', 'file-added', 'file-removed', 'hide-menu', 'render'] as const

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

type CodeBlockHeaderEnvironment = (typeof CODE_BLOCK_HEADER_ENVIRONMENTS)[number]

const KEY_VALUE_PAIR_RE =
  /(?<name>[a-zA-Z_-]+)(?:=(?:"(?<doubleQuotedValue>[^"]*)"|'(?<singleQuotedValue>[^']*)'|(?<bareValue>[^\s"'=]+)))?/g
const CODE_BLOCK_PRE_PROP_NAME_SET = new Set<string>(CODE_BLOCK_PRE_PROP_NAMES)

const normalizeCodeBlockEnv = (value: unknown): CodeBlockHeaderEnvironment | null => {
  if (typeof value !== 'string') {
    return null
  }

  const normalizedValue = value.trim().toLowerCase()
  return CODE_BLOCK_HEADER_ENVIRONMENTS.includes(normalizedValue as CodeBlockHeaderEnvironment)
    ? (normalizedValue as CodeBlockHeaderEnvironment)
    : null
}

export const parseMetaString = <Name extends string = string>(meta: unknown, propNames?: Name[]): ParsedMeta<Name> => {
  if (typeof meta !== 'string' || meta.trim() === '') {
    return { props: {}, rest: '', tokens: [] }
  }

  const props: ParsedMeta['props'] = {}
  const tokens: ParsedMetaToken[] = []
  const rest = meta.replaceAll(KEY_VALUE_PAIR_RE, (match, ...args) => {
    const groups = args.at(-1) as
      | {
          bareValue?: string
          doubleQuotedValue?: string
          name?: string
          singleQuotedValue?: string
        }
      | undefined
    const name = groups?.name
    if (!name) {
      return match
    }

    const value = groups?.doubleQuotedValue ?? groups?.singleQuotedValue ?? groups?.bareValue
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

export const stripMetaProps = <Name extends string = string>(meta: unknown, propNames: Name[]) => {
  return parseMetaString(meta, propNames).rest
}

export const getCodeBlockPropsFromMeta = (meta: unknown) => {
  const parsed = parseMetaString(meta)
  const props = Object.fromEntries(
    Object.entries(parsed.props).filter(([name]) => CODE_BLOCK_PRE_PROP_NAME_SET.has(name)),
  ) as Record<string, string>
  const explicitTitle =
    typeof parsed.props.title === 'string' && parsed.props.title.trim() ? parsed.props.title.trim() : null
  const env = normalizeCodeBlockEnv(parsed.props.env)

  return {
    props,
    env,
    title: explicitTitle,
  }
}
