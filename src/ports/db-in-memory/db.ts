import { DBArticle, DBComment, DBUser } from '@/ports/adapters'

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
