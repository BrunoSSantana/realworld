import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'
import * as E from 'fp-ts/lib/Either'

import { getError } from '@/helper'

import { registerUserAdapter } from '@/core/user/use-cases/register-user-adapter'
import { CreateUser, LoginUser } from '@/core/user/types/user-types'

import { createUserInDB, login } from '@/ports/adapters/db/domains'

export const httpRegisterUser = (data: CreateUser) => {
  return pipe(
    data,
    registerUserAdapter(createUserInDB),
    TE.mapLeft(err => getError(err.message)),
  )
}

export const httpLogin = (data: LoginUser) => {
  return pipe(
    TE.tryCatch(
      () => login(data),
      E.toError,
    ),
    TE.mapLeft(error => getError(error.message)),
  )
}
