import * as t from 'io-ts'
import { withMessage } from 'io-ts-types'

function isDate (input: string) {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(input)
}

type DateBrand = {
  readonly Date: unique symbol
}

export const dateCodec = withMessage(
  t.brand(
    t.string,
    (date): date is t.Branded<string, DateBrand> => isDate(date),
    'Date',
  ),
  () => 'Data inválida, use o formato ISO 8601',
)
