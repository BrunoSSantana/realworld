import { CreateArticle, createArticleCodec } from '@/core/article/types/article-types'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/lib/function'
import { failure } from 'io-ts/lib/PathReporter'

type ValidateArticle = (data: CreateArticle) => E.Either<Error, unknown>

export const validateArticle: ValidateArticle = (data) => {
  return pipe(
    createArticleCodec.decode(data),
    E.mapLeft(errors => new Error(failure(errors).join(':::'))),
  )
}
