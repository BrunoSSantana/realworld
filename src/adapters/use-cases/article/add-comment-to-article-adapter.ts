import { CommentOutput } from '@/core/types/comment'
import * as comment from '@/core/use-cases/article/create-comment'

export type OutsideRegisterComment = comment.OutsideCreateComment<
 CommentOutput>

export const addCommentToAnArticle: comment.AddCommentToAnArticle = (outsideCreateComment) => (data) => {
  return comment.addCommentToAnArticle(outsideCreateComment)(data)
}
