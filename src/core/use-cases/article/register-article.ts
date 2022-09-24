import { pipe } from 'fp-ts/lib/function'
import { CreateArticle } from '@/core/types/article'
import { validateArticle } from './validate-article'
import * as TE from 'fp-ts/lib/TaskEither'
import * as E from 'fp-ts/lib/Either'

export type OutsideRegisterArticle<A> = (data: CreateArticle) => Promise<A>

export type RegisterArticle = <A>(outsideRegister: OutsideRegisterArticle<A>) =>
  (data: CreateArticle) => TE.TaskEither<Error, A>

export const registerArticle: RegisterArticle = (outsideRegister) => (data) => {
  return pipe(
    data,
    validateArticle,
    TE.fromEither,
    TE.chain(() =>
      TE.tryCatch(
        () => outsideRegister(data),
        E.toError,
      ),
    ),
  )
}
