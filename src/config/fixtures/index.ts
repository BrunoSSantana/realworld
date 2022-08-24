import { Email } from '@/core/types/scalar'
import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'
import * as E from 'fp-ts/lib/Either'

export function unsafeEmail (email: string): Email {
  return email as any
}

type CallBack = (input: unknown) => unknown

type MapAllTE = (fn: CallBack) => (data: TE.TaskEither<unknown, unknown>) =>
  TE.TaskEither<unknown, unknown>

type MapAllE = (fn: CallBack) => (data: E.Either<unknown, unknown>) =>
  E.Either<unknown, unknown>

export const mapAllTE: MapAllTE = (fn: CallBack) => (data: TE.TaskEither<unknown, unknown>) => {
  return pipe(
    data,
    TE.map(fn),
    TE.mapLeft(fn),
  )
}
export const mapAllE: MapAllE = (fn: CallBack) => (data: E.Either<unknown, unknown>) => {
  return pipe(
    data,
    E.map(fn),
    E.mapLeft(fn),
  )
}
