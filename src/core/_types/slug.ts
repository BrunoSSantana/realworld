import * as t from 'io-ts'
import { withMessage } from 'io-ts-types'

type SlugBrand = {
  readonly Slug: unique symbol
}

export const slugCodec = withMessage(
  t.brand(
    t.string,
    (value): value is t.Branded<string, SlugBrand> => isSlug(value),
    'Slug',
  ),
  () => 'Slug inválido, use apenas letras minúsculas, números e traços com 3 ou mais caracteres',
)

export type Slug = t.TypeOf<typeof slugCodec>

function isSlug (value: string) {
  /**
   * Accept:
   * - must starts with any letter;
   * - followed by a letter, a number, an underline or a dash;
   * - must ends with a letter or a number.
   */
  return /^[a-z][a-z0-9_-]+?[a-z0-9]$/.test(value)
}
