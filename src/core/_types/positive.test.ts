import { it, expect } from 'vitest'

import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'
import { getErrorMessage, mapAll } from '@/config/fixtures'
import { positiveCodec } from './positive'

it('Deveria aceitar valores positivos', async () => {
  const valor = 5

  return pipe(
    valor,
    positiveCodec.decode,
    TE.fromEither,
    mapAll(result => expect(result).toBe(valor)),
  )()
})

it('Deveria aceitar valor 0', async () => {
  const valor = 0

  return pipe(
    valor,
    positiveCodec.decode,
    TE.fromEither,
    mapAll(result => expect(result).toBe(valor)),
  )()
})

it('Deveria retornar um erro quando o valor negativo', async () => {
  const valorInvalido = -9

  return pipe(
    valorInvalido,
    positiveCodec.decode,
    TE.fromEither,
    mapAll(error =>
      expect(getErrorMessage(error)).toBe('O valor deve ser positivo'),
    ),
  )()
})

it('Deveria retornar um erro quando o valor passado for string', async () => {
  const valorInvalido = '9'

  return pipe(
    valorInvalido,
    positiveCodec.decode,
    TE.fromEither,
    mapAll(error =>
      expect(getErrorMessage(error)).toBe('O valor deve ser positivo'),
    ),
  )()
})
