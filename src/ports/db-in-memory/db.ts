import { DBArticle, DBUser } from '@/ports/adapters'

type DBInMemory = {
  users: { [id: string]: DBUser },
  articles: { [id: string]: DBArticle }
}

export const db: DBInMemory = {
  users: {},
  articles: {},
}
