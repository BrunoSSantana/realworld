import { CommentOutput } from '@/core/article/types/comment-types'
import { AddCommentToAnArticle, OutsideCreateComment } from './add-comment-to-an-article'

export type OutsideRegisterComment = OutsideCreateComment<
  CommentOutput>

export const addCommentToAnArticle: AddCommentToAnArticle = (outsideCreateComment) => (data) => {
  return addCommentToAnArticle(outsideCreateComment)(data)
}
