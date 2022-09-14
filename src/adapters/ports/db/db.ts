import * as db from '@/ports/db-in-memory/db'
import * as jwt from '@/adapters/ports/jwt/jwt'
import * as user from '@/adapters/use-cases/user/register-user-adapter'
import * as article from '@/adapters/use-cases/article/register-article-adapter'
import * as comment from '@/adapters/use-cases/article/add-comment-to-article-adapter'

export const createUserInDB: user.OutsideRegisterUser = async (data) => {
  const { user: registeredUser } = await db.outsideRegisterUser(data)

  const token = await jwt.generateToken({ id: registeredUser.id })
  // return db.outsideRegisterUser({
  //   ...data,
  //    token
  //   })
  return {
    user: {
      username: registeredUser.username,
      email: registeredUser.email,
      bio: '',
      image: undefined,
      token,
    },
  }
}

export const createArticleInDB: article.OutsideRegisterArticle = (data) => {
  return db.outsideRegisterArticle(data)
}

export const addCommentToAnArticleInDB: comment.OutsideRegisterComment = (data) => {
  return db.outsideAddCommentToAnArticle(data)
}
