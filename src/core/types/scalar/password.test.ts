import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'
import { getErrorMessage, mapAll } from '@/config/fixtures'
import { passwordCodec } from './password'

it('Deveria aceitar uma senha com mais de 8 caracteres', async () => {
  const senha = '123456789'

  return pipe(
    senha,
    passwordCodec.decode,
    TE.fromEither,
    mapAll(result => expect(result).toBe(senha)),
  )()
})

it('Deveria aceitar valor senha com 8 caracteres', async () => {
  const senha = '12345678'

  return pipe(
    senha,
    passwordCodec.decode,
    TE.fromEither,
    mapAll(result => expect(result).toBe(senha)),
  )()
})

it('Deveria retornar um erro quando a senha possuir menos de 8 caracteres', async () => {
  const senhaInvalida = '1234567'

  return pipe(
    senhaInvalida,
    passwordCodec.decode,
    TE.fromEither,
    mapAll(error =>
      expect(getErrorMessage(error)).toBe('A Senha deve ter 8 ou mais caracteres'),
    ),
  )()
})
