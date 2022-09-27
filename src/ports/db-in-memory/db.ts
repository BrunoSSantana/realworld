import { DBUser, DBArticle, DBComment } from '@/ports/adapters/db/types'

type ArticleID = string

type DBInMemory = {
  users: { [id: string]: DBUser },
  articles: { [id: string]: DBArticle }
  articlesBySlug: { [slug: string]: ArticleID }
  comments: { [articleId: string]: DBComment[] }
}

export const db: DBInMemory = {
  users: {},
  articles: {},
  articlesBySlug: {},
  comments: {},
}
