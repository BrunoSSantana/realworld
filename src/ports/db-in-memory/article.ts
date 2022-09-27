import slugify from 'slugify'
import { v4 as uuidv4 } from 'uuid'

import { CreateArticle } from '@/core/types/article'
import { DBArticle } from '@/ports/adapters'
import { CreateComment } from '@/core/types/comment'
import { db } from './db'
import { ProfileOutput } from '@/core/types/profile'

type CreateArticleInDB = (data: CreateArticle) => Promise<DBArticle | undefined>

export const createArticleInDB: CreateArticleInDB = async (data) => {
  const id = uuidv4()
  const date = new Date().toISOString()

  // const author = getUserProfileFromDB(data.authorId)

  const articleSlug = slugify(data.title, { lower: true })

  db.articlesBySlug[articleSlug] = id

  const registeredArticle = db.articles[id] = {
    id,
    slug: articleSlug,
    title: data.title,
    description: data.description,
    body: data.body,
    tagList: data.tagList ?? [],
    createdAt: date,
    updatedAt: date,
    favoritesCount: 0,
    authorId: data.authorId,
  }

  return registeredArticle
}

export const addCommentToAnArticleInDB = async (data: CreateComment) => {
  const date = new Date().toISOString()
  const id = Date.now()
  const articleId = db.articlesBySlug[data.articleSlug] || ''

  const author = getUserProfileFromDB(data.authorId)

  const comment = {
    id,
    createdAt: date,
    updatedAt: date,
    body: data.body,
    articleId,
    authorId: data.authorId,
  }

  db.comments[articleId] = (db.comments[articleId] ?? []).concat(comment)

  return { ...comment, author }
}

const getUserProfileFromDB = (userId: string): ProfileOutput => {
  const user = db.users[userId]

  if (!user) {
    throw new Error('User does not exist')
  }

  return {
    username: user.username,
    bio: user.bio ?? '',
    image: user.image ?? '',
    following: false,
  }
}
