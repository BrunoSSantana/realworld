import { ArticleOutput } from '@/core/article/types/article-types'
import { CommentOutput } from '@/core/article/types/comment-types'
import { UserOutput } from '@/core/user/types/user-types'

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
