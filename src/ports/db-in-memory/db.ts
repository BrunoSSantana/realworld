import { OutsideCreateCommentType } from '@/adapters/use-cases/article/add-comment-to-article-adapter'
import {
  OutsideRegisterArticleType,
} from '@/adapters/use-cases/article/register-article-adapter'
import {
  OutsideRegisterUserType,
} from '@/adapters/use-cases/user/register-user-adapter'
import slugify from 'slugify'

// outside faker
export const outsideRegister: OutsideRegisterUserType = async (data) => {
  return {
    user: {
      email: data.email,
      username: data.username,
      bio: undefined,
      token: undefined,
      image: undefined,
    },
  }
}

export const outsideRegisterArticle: OutsideRegisterArticleType = async (data) => {
  const date = new Date().toISOString()
  return {
    article: {
      slug: slugify(data.title, { lower: true }),
      title: data.title,
      description: data.description,
      body: data.body,
      tagList: data.tagList ?? [],
      createdAt: date,
      updatedAt: date,
      favorited: false,
      favoritesCount: 0,
      author: undefined,
    },
  }
}

export const outsideAddCommentToAnArticle: OutsideCreateCommentType = async (data) => {
  const date = new Date().toISOString()
  return {
    comment: {
      // TODO: add uuid
      id: Date.now(),
      createdAt: date,
      updatedAt: date,
      body: data.body,
      author: undefined,
    },
  }
}
