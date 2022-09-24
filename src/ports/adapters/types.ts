import { ArticleOutput } from '@/core/types/article'
import { User } from '@/core/types/user'

export type DBUser = User & {
  id: string,
  password: string,
}

export type DBArticle = Omit<ArticleOutput, 'favorited' | 'author'> & {
  id: string
  authorId: string
}
