import slugify from 'slugify'
import { v4 as uuidv4 } from 'uuid'

import * as comment from '@/adapters/use-cases/article/add-comment-to-article-adapter'
import * as article from '@/adapters/use-cases/article/register-article-adapter'
import * as user from '@/adapters/use-cases/user/register-user-adapter'

type DBUser = user.User & {
  id: string,
  password: string,
}

type DB = {
  users: {
    [id: string]: DBUser,
  }
}

const db: DB = {
  users: {},
}

type OutsideRegisterUser = (data: user.CreateUser) => Promise<DBUser | undefined>

// PAREI EM 1:20:15 - 021 : Implementação de banco de dados em memória com Node.js + TypeScript

// outside faker
export const outsideRegisterUser: OutsideRegisterUser = async (data) => {
  const id = uuidv4()

  db.users[id] = {
    id,
    email: data.email,
    username: data.username,
    password: data.password,
  }

  return db.users[id]
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
