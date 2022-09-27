import * as t from 'io-ts'
import { withMessage } from 'io-ts-types'

type PositiveBrand = {
  readonly Positive : unique symbol
}

export const positiveCodec = withMessage(
  t.brand(
    t.number,
    (value): value is t.Branded<number, PositiveBrand> => value >= 0,
    'Positive',
  ),
  () => 'O valor deve ser positivo',
)

export type Positive = t.TypeOf<typeof positiveCodec>
