import {
  OutsideRegisterType as OutsideRegisterArticle,
} from '@/adapters/use-cases/article/register-article-adapter'
import {
  OutsideRegisterType as OutsideRegisterUser,
} from '@/adapters/use-cases/user/register-user-adapter'
import slugify from 'slugify'

// outside faker
export const outsideRegister: OutsideRegisterUser = async (data) => {
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

export const outsideRegisterArticle: OutsideRegisterArticle = async (data) => {
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
