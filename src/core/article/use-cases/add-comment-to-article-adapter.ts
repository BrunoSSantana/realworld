import { CommentOutput } from '@/core/article/types/comment-types'
import { addCommentToAnArticle, AddCommentToAnArticle, OutsideCreateComment } from './add-comment-to-an-article'

export type OutsideRegisterComment = OutsideCreateComment<
  CommentOutput>

export const addCommentToAnArticleAdapter: AddCommentToAnArticle = (outsideCreateComment) => (data) => {
  return addCommentToAnArticle(outsideCreateComment)(data)
}
