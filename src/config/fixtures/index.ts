import { Email } from '@/core/types/scalar'
import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'

export function unsafeEmail (email: string): Email {
  return email as any
}

type CallBack = (input: unknown) => unknown

type MapAll = (fn: CallBack) => (data: TE.TaskEither<unknown, unknown>) =>
  TE.TaskEither<unknown, unknown>

export const mapAll: MapAll = (fn: CallBack) => (data: TE.TaskEither<unknown, unknown>) => {
  return pipe(
    data,
    TE.map(fn),
    TE.mapLeft(fn),
  )
}

export function getErrorMessage (error: unknown): string {
  return Array.isArray(error) ? error[0].message : error
}
