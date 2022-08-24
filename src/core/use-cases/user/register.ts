import * as TE from 'fp-ts/lib/TaskEither'
import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import { CreateUser } from '@/core/types/user'

export type OutsideRegister<A> = (data: CreateUser) => Promise<A>;

export type Register = <A>(outsideRegister: OutsideRegister<A>) =>
  (data: CreateUser) => TE.TaskEither<Error, A>

export const register: Register = (outsideRegister) =>
  (data) => {
    return pipe(
      TE.tryCatch(
        () => outsideRegister(data),
        E.toError,
      ),
    )
  }
