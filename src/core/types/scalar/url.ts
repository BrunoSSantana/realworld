import * as t from 'io-ts'
import { withMessage } from 'io-ts-types'

function isUrl (input: string): boolean {
  try {
    const url = new URL(typeof input === 'string' ? input : '')

    return !!url
  } catch {
    return false
  }
}

type UrlBrand = {
  readonly Url: unique symbol
}

export const urlCodec = withMessage(
  t.brand(
    t.string,
    (url): url is t.Branded<string, UrlBrand> => isUrl(url),
    'Url',
  ),
  () => 'Url inválida',
)

export type Url = t.TypeOf<typeof urlCodec>
