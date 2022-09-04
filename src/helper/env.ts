import * as t from 'io-ts'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/lib/function'
import { withMessage } from 'io-ts-types'
import { failure } from 'io-ts/lib/PathReporter'

type LengthBrand = {
  readonly NonemptyString: unique symbol
}

const isNonEmptyString = (value: unknown) => {
  return typeof value === 'string' && value.length > 0
}

const nonemptyStringCodec = t.brand(
  t.string,
  (value): value is t.Branded<string, LengthBrand> => isNonEmptyString(value),
  'NonemptyString',
)

export const env = (value: string) => {
  const envCodec = withMessage(
    nonemptyStringCodec,
    () => `Environment variable ${value} is not defined`,
  )

  return pipe(
    envCodec.decode(process.env[value]),
    E.fold(
      (errors) => { throw new Error(failure(errors).join(':::')) },
      (value) => value,
    ),
  )
}
