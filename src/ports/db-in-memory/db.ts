import slugify from 'slugify'

import * as comment from '@/adapters/use-cases/article/add-comment-to-article-adapter'
import * as article from '@/adapters/use-cases/article/register-article-adapter'
import * as user from '@/adapters/use-cases/user/register-user-adapter'

// outside faker
export const outsideRegisterUser: user.OutsideRegisterUser = async (data) => {
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

export const outsideRegisterArticle: article.OutsideRegisterArticle = async (data) => {
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

export const outsideAddCommentToAnArticle: comment.OutsideRegisterComment = async (data) => {
  const date = new Date().toISOString()
  return {
    comment: {
      id: Date.now(),
      createdAt: date,
      updatedAt: date,
      body: data.body,
      author: undefined,
    },
  }
}
