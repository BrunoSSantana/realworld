import * as TE from 'fp-ts/TaskEither'
import * as E from 'fp-ts/Either'
import { CreateComment, createCommentCodec } from '@/core/types/comment'
import { pipe } from 'fp-ts/lib/function'
import { failure } from 'io-ts/lib/PathReporter'

export type OutsideCreateComment<A> = (data: CreateComment) => Promise<A>

export type AddCommentToAnArticle = <A>(o: OutsideCreateComment<A>) =>
  (data: CreateComment) => TE.TaskEither<Error, A>

export const addCommentToAnArticle: AddCommentToAnArticle = (outsideCreateComment) => (data) => {
  return pipe(
    data,
    validateCreateComment,
    TE.fromEither,
    TE.chain(
      () => TE.tryCatch(
        () => outsideCreateComment(data),
        E.toError,
      ),
    ),
  )
}

type ValidateCreateComment = (data: CreateComment) => E.Either<Error, CreateComment>

export const validateCreateComment: ValidateCreateComment = (data) =>
  pipe(
    createCommentCodec.decode(data),
    E.mapLeft(errors => new Error(failure(errors).join(':::'))),
  )
