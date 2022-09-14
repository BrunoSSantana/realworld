import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'

export function unsafe <T> (value: unknown): T {
  return value as T
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

export const getErrorMessage = (error: unknown): string =>
  Array.isArray(error) ? error[0].message : error
