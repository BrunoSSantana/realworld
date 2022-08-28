import * as t from 'io-ts'
import { profileCodec } from '@/core/types/profile'
import { dateCodec, positiveCodec, slugCodec } from '@/core/types/scalar'
import { tagCodec } from './tag'

export const articleCodec = t.type({
  slug: slugCodec,
  title: t.string,
  description: t.string,
  body: t.string,
  tagList: t.array(tagCodec),
  createdAt: dateCodec,
  updatedAt: dateCodec,
  favorited: t.boolean,
  favoritesCount: positiveCodec,
  author: profileCodec,
})

export type Article = t.TypeOf<typeof articleCodec>

export const articlesCodec = t.type({
  articles: t.array(articleCodec),
  articlesCount: positiveCodec,
})

export type Articles = t.TypeOf<typeof articlesCodec>

export const createArticleRequired = t.type({
  title: t.string,
  description: t.string,
  body: t.string,
})

export const createArticlePartial = t.partial({
  taglist: t.array(tagCodec),
})

export const createArticleCodec = t.intersection([
  createArticleRequired,
  createArticlePartial,
])

export type CreateArticle = t.TypeOf<typeof createArticleCodec>
