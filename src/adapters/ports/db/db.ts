import * as db from '@/ports/db-in-memory'
import * as jwt from '@/adapters/ports/jwt/jwt'
import * as user from '@/adapters/use-cases/user/register-user-adapter'
import * as article from '@/adapters/use-cases/article/register-article-adapter'
import * as comment from '@/adapters/use-cases/article/add-comment-to-article-adapter'

export const createUserInDB: user.OutsideRegisterUser = async (data) => {
  const registeredUser = await db.createUserInDB(data)

  if (!registeredUser) {
    throw new Error('Internal error registering user!')
  }

  const token = await jwt.generateToken({ id: registeredUser?.id })

  return {
    user: {
      username: registeredUser!.username,
      email: registeredUser!.email,
      bio: '',
      image: undefined,
      token,
    },
  }
}

export const createArticleInDB: article.OutsideRegisterArticle = async (data) => {
  const registeredArticle = await db.createArticleInDB(data)

  if (!registeredArticle) {
    throw new Error('Internal error registering article!')
  }

  const { authorId, ...articleWithoutAuthorId } = registeredArticle

  return {
    article: {
      ...articleWithoutAuthorId,
      favorited: false,
    },
  }
}

export const addCommentToAnArticleInDB: comment.OutsideRegisterComment = (data) => {
  return db.addCommentToAnArticleInDB(data)
}
