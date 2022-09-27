import { it, expect } from 'vitest'

import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'
import { getErrorMessage, mapAll } from '@/config/fixtures'
import { emailCodec } from './email'

it('Deveria validar o email corretamente', async () => {
  const emailValid = 'valid@email.com'

  return pipe(
    emailValid,
    emailCodec.decode,
    TE.fromEither,
    mapAll(result => expect(result).toBe(emailValid)),
  )()
})

it('Deveria retornar um erro quando o email for inválido', async () => {
  const emailInvalido = 'invalid-email'

  return pipe(
    emailInvalido,
    emailCodec.decode,
    TE.fromEither,
    mapAll(error => expect(getErrorMessage(error)).toBe('Email inválido'),
    ),
  )()
})
