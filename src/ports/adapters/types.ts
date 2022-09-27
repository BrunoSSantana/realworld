import { ArticleOutput } from '@/core/types/article'
import { CommentOutput } from '@/core/types/comment'
import { UserOutput } from '@/core/types/user'

export type DBUser = Omit<UserOutput, 'token'> & {
  id: string,
  password: string,
}

export type DBArticle = Omit<ArticleOutput, 'favorited' | 'author'> & {
  id: string
  authorId: string
}

export type DBComment = Omit<CommentOutput, 'author'> & {
  articleId: string,
  authorId: string,
}
