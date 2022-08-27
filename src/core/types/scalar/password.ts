import * as t from 'io-ts'
import { withMessage } from 'io-ts-types'

type PasswordBrand = {
  readonly Password : unique symbol
}

export const passwordCodec = withMessage(
  t.brand(
    t.string,
    (value): value is t.Branded<string, PasswordBrand> => value.length >= 8,
    'Password',
  ),
  () => 'A Senha deve ter 8 ou mais caracteres',
)

export type Password = t.TypeOf<typeof passwordCodec>
