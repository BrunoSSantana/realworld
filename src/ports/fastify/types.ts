import { RequestGenericInterface } from 'fastify'

import { CreateArticle } from '@/core/article/types/article-types'
import { CreateUser, LoginUser } from '@/core/user/types/user-types'
import { CreateComment } from '@/core/article/types/comment-types'
import { Slug } from '@/core/_types/slug'

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

export type AddCommentApi = {
  Body: {
    comment: CreateComment
  }

  Params: {
    slug: Slug
  }
}

export type CustomRequestFastify = RequestGenericInterface & {
  Querystring: {
    name: string
  }
}
