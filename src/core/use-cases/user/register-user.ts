import * as TE from 'fp-ts/lib/TaskEither'
import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import { CreateUser } from '@/core/types/user'
import { validateUser } from './validate-user'

export type OutsideRegister<A> = (data: CreateUser) => Promise<A>;

export type RegisterUser = <A>(outsideRegister: OutsideRegister<A>) =>
  (data: CreateUser) => TE.TaskEither<Error, A>

export const registerUser: RegisterUser = (outsideRegister) =>
  (data) => {
    return pipe(
      data,
      validateUser,
      // transforma o either em taskEither
      TE.fromEither,
      // pega o taskEither e manda pro trycatch
      TE.chain(
        // trycatch verifica se é right ou left
        () => TE.tryCatch(
          // se é right, chama o outsideRegister
          () => outsideRegister(data),
          // se é left, retorna o erro
          E.toError,
        )),
    )
  }
