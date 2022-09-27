import * as E from 'fp-ts/Either'
import { CreateUser, createUserCodec } from '@/core/user/types/user-types'
import { pipe } from 'fp-ts/lib/function'
import { failure } from 'io-ts/PathReporter'

type ValidateUser = (data: CreateUser) => E.Either<Error, unknown>

export const validateUser: ValidateUser = data => {
  return pipe(
    createUserCodec.decode(data),
    E.mapLeft(errors => new Error(failure(errors).join(':::'))),
  )
}
