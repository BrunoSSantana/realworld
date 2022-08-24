import * as t from 'io-ts'
import { withMessage } from 'io-ts-types'

function isSlug (input: string) {
  return /^[a-z][a-z0-9-]+?[a-z0-9]$/.test(input)
}

type SlugBrand = {
  readonly Slug: unique symbol
}

export const slugCodec = withMessage(
  t.brand(
    t.string,
    (slug): slug is t.Branded<string, SlugBrand> => isSlug(slug),
    'Slug',
  ),
  () => 'Slug inválido, use apenas letras, números e traços',
)

export type Slug = t.TypeOf<typeof slugCodec>
