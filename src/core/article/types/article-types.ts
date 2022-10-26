import * as t from 'io-ts'
import { UUID, withMessage } from 'io-ts-types'

import { profileCodec } from '@/core/user/types/profile-types'
import { dateCodec, positiveCodec, slugCodec } from '@/core/_types'
import { tagCodec } from './tag-types'

const articleCodecRequired = t.type({
  slug: slugCodec,
  title: t.string,
  description: t.string,
  body: t.string,
  tagList: t.array(slugCodec),
  createdAt: dateCodec,
  updatedAt: dateCodec,
  favorited: t.boolean,
  favoritesCount: positiveCodec,
})

const articleCodecOptional = t.partial({
  author: profileCodec,
})

export const articleCodec = t.intersection([
  articleCodecRequired,
  articleCodecOptional,
])

export type Article = t.TypeOf<typeof articleCodec>
export type ArticleOutput = t.OutputOf<typeof articleCodec>

export const articlesCodec = t.type({
  articles: t.array(articleCodec),
  articlesCount: positiveCodec,
})

export type Articles = t.TypeOf<typeof articlesCodec>

const authorIdCodec = withMessage(UUID, () => 'Invalid author ID')

export type AuthorId = t.TypeOf<typeof authorIdCodec>
export type AuthorIdOutPut = t.OutputOf<typeof authorIdCodec>

export const createArticleRequired = t.type({
  title: withMessage(t.string, () => 'Invalid title'),
  description: withMessage(t.string, () => 'Invalid description'),
  body: withMessage(t.string, () => 'Invalid body'),
  authorId: withMessage(UUID, () => 'Invalid authorId'),
})

export const createArticlePartial = t.partial({
  tagList: t.array(tagCodec),
})

export const createArticleCodec = t.intersection([
  createArticleRequired,
  createArticlePartial,
])

export type CreateArticle = t.TypeOf<typeof createArticleCodec>
export type CreateArticleOutput = t.OutputOf<typeof createArticleCodec>

export type CreateArticleInput = CreateArticleOutput & {
  slug: string
}
