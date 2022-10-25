import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'

import { getError } from '@/ports/adapters/http/http'

import { addCommentToAnArticleInDB, createArticleInDB } from '@/ports/adapters/db/domains'

import { CreateArticle } from '@/core/article/types/article-types'
import { CreateComment } from '@/core/article/types/comment-types'
import { registerArticleAdapter } from '@/core/article/use-cases/register-article-adapter'
import { addCommentToAnArticleAdapter } from '@/core/article/use-cases/add-comment-to-article-adapter'

export const httpRegisterArticle = (data: CreateArticle) => {
  return pipe(
    data,
    registerArticleAdapter(createArticleInDB),
    TE.mapLeft(err => getError({ errors: err.message, context: 'articlee' })),
  )
}

export const httpAddCommentToAnArticle = (data: CreateComment) => {
  return pipe(
    data,
    addCommentToAnArticleAdapter(addCommentToAnArticleInDB),
    TE.mapLeft(err => getError({ errors: err.message, context: 'comment' })),
  )
}
