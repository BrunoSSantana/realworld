
import slugify from 'slugify'
import { v4 as uuidv4 } from 'uuid'

import * as comment from '@/adapters/use-cases/article/add-comment-to-article-adapter'
import { CreateArticle } from '@/core/types/article'
import { db, DBArticle } from './db'

type CreateArticleInDB = (data: CreateArticle) => Promise<DBArticle | undefined>

export const createArticleInDB: CreateArticleInDB = async (data) => {
  const id = uuidv4()
  const date = new Date().toISOString()
  const { authorId, ...article } = data

  const author = db.users[authorId]

  if (!author) {
    throw new Error('Author not found')
  }

  const registeredArticle = db.articles[id] = {
    id,
    slug: slugify(article.title, { lower: true }),
    title: article.title,
    description: article.description,
    body: article.body,
    tagList: article.tagList ?? [],
    createdAt: date,
    updatedAt: date,
    favoritesCount: 0,
    authorId,
  }

  return registeredArticle
}

export const addCommentToAnArticleInDB: comment.OutsideRegisterComment = async (data) => {
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
