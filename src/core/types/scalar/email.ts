import * as t from 'io-ts'
import { withMessage } from 'io-ts-types'

export type EmailBrand = {
  readonly Email: unique symbol
}

export const isEmail = (value: string): boolean => /^\w+.+?@\w+.+?$/.test(value)

export const emailCodec = withMessage(
  t.brand(
    t.string,
    (value): value is t.Branded<string, EmailBrand> => isEmail(value),
    'Email',
  ),
  () => 'Email inválido',
)

export type Email = t.TypeOf<typeof emailCodec>
