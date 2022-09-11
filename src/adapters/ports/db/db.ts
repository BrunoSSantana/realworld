import * as db from '@/ports/db-in-memory/db'
import * as jwt from '@/adapters/ports/jwt/jwt'
import * as user from '@/adapters/use-cases/user/register-user-adapter'
import * as article from '@/adapters/use-cases/article/register-article-adapter'
import * as comment from '@/adapters/use-cases/article/add-comment-to-article-adapter'

export const createUserInDB: user.OutsideRegisterUser = async (data) => {
  const token = await jwt.generateToken({ id: '2' })
  return db.outsideRegisterUser({ ...data, token })
}

export const createArticleInDB: article.OutsideRegisterArticle = (data) => {
  return db.outsideRegisterArticle(data)
}

export const addCommentToAnArticleInDB: comment.OutsideRegisterComment = (data) => {
  return db.outsideAddCommentToAnArticle(data)
}
