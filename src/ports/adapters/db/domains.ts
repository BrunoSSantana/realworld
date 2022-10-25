import * as db from '@/ports/db-in-memory'
import * as jwt from '@/ports/adapters/jwt/jwt'
import * as user from '@/core/user/use-cases/register-user-adapter'
import * as article from '@/core/article/use-cases/register-article-adapter'
import * as comment from '@/core/article/use-cases/add-comment-to-article-adapter'
import { LoginUser, UserOutput } from '@/core/user/types/user-types'
import slugify from 'slugify'

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
      image: '',
      token,
    },
  }
}

export type Login = (data: LoginUser) => Promise<{ user: UserOutput }>
export const login: Login = async (data) => {
  const userData = await db.login(data)

  const token = await jwt.generateToken({ id: userData.id })

  return {
    user: {
      email: userData.email,
      username: userData.username,
      bio: userData.bio ?? '',
      image: userData.image ?? '',
      token,
    },
  }
}

export const createArticleInDB: article.OutsideRegisterArticle = async (data) => {
  const slug = slugify(data.title, { lower: true })

  const registeredArticle = await db.createArticleInDB({ ...data, slug })

  if (!registeredArticle) {
    throw new Error('Internal error registering article!')
  }

  const { authorId, ...articleWithoutAuthorId } = registeredArticle

  return {
    article: {
      ...articleWithoutAuthorId,
      favorited: false,
      // author,
    },
  }
}

export const addCommentToAnArticleInDB: comment.OutsideRegisterComment = async (data) => {
  const comment = await db.addCommentToAnArticleInDB(data)

  return { comment }
}
