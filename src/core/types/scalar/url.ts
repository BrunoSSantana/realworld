import { constFalse, constTrue, pipe } from 'fp-ts/lib/function'
import * as t from 'io-ts'
import * as E from 'fp-ts/lib/Either'
import { withMessage } from 'io-ts-types'

const validString = (input: unknown) => typeof input === 'string' ? input : ''

function isUrl (input: string): boolean {
  return pipe(
    E.tryCatch(
      () => new URL(validString(input)),
      E.toError,
    ),
    E.fold(constFalse, constTrue),
  )
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
