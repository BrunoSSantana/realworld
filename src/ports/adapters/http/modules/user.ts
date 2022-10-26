import { getCurrentUserFromDB } from '@/ports/db-in-memory'
import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'
import * as E from 'fp-ts/lib/Either'

import { registerUserAdapter } from '@/core/user/use-cases/register-user-adapter'
import { CreateUser, LoginUser } from '@/core/user/types/user-types'

import { getError } from '@/ports/adapters/http/http'
import { createUserInDB, login } from '@/ports/adapters/db/domains'
import { JWTPayload } from '@/ports/adapters/jwt/jwt'

// TODO: trazer a criação do token e retorno dos dados da forma que a
// API espera para esse adapter (hoje está no adapter de banco)

export const httpRegisterUser = (data: CreateUser) => {
  return pipe(
    data,
    registerUserAdapter(createUserInDB),
    TE.mapLeft(err => getError({ errors: err.message, context: 'user' })),
  )
}

export const httpLogin = (data: LoginUser) => {
  return pipe(
    TE.tryCatch(
      () => login(data),
      E.toError,
    ),
    TE.mapLeft(error => getError({ errors: error.message, context: 'user' })),
  )
}

export const httpGetCurrentUser = async (payload: JWTPayload, token: string) => {
  // TODO: usar uma pipeline
  const { id: userId } = payload

  if (!userId) {
    throw new Error('User ID should be a string')
  }

  const user = await getCurrentUserFromDB(userId)

  if (!user) {
    throw new Error('User does not exists')
  }

  return {
    user: {
      username: user.username,
      email: user.email,
      token,
      bio: user.bio ?? '',
      image: user.image ?? '',
    },
  }
}
