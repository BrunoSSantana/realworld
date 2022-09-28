import { DBUser, DBArticle, DBComment } from '@/ports/adapters/db/types'

type ArticleID = string
type UserId = string

type DBInMemory = {
  users: { [id: string]: DBUser },
  usersByEmail: {[email: string]: UserId},
  articles: { [id: string]: DBArticle }
  articlesBySlug: { [slug: string]: ArticleID }
  comments: { [articleId: string]: DBComment[] }
}

export const db: DBInMemory = {
  users: {},
  usersByEmail: {},
  articles: {},
  articlesBySlug: {},
  comments: {},
}
