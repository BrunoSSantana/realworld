import { CreateArticle } from '@/core/article/types/article-types'
import { CreateUser, LoginUser } from '@/core/user/types/user-types'
import { RequestGenericInterface } from 'fastify'

export type ApiUserCreate = {
  Body: {
    user: CreateUser
  }
}

export type ApiUserLogin = {
  Body: {
    user: LoginUser
  }
}

export type ApiCreateArticle = {
  Body: {
    article: CreateArticle
  }
}

export type CustomRequestFastify = RequestGenericInterface & {
  Querystring: {
    name: string
  }
}
