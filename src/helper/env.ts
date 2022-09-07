import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/lib/function'
import { NonEmptyString, withMessage } from 'io-ts-types'
import { failure } from 'io-ts/lib/PathReporter'

export const env = (value: string) => {
  const envCodec = withMessage(
    NonEmptyString,
    () => `Environment variable ${value} is not defined`,
  )

  return pipe(
    envCodec.decode(process.env[value]),
    E.fold(
      (errors) => { throw new Error(failure(errors).join(':::')) },
      (value) => value,
    ),
  )
}
