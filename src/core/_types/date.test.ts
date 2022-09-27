import { it, expect } from 'vitest'

import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'
import { getErrorMessage, mapAll } from '@/config/fixtures'
import { dateCodec } from './date'

it('Deveria validar o date corretamente', async () => {
  const data = new Date().toISOString()

  return pipe(
    data,
    dateCodec.decode,
    TE.fromEither,
    mapAll(result => expect(result).toBe(data)),
  )()
})

it('Deveria retornar um erro quando o date for mandado eu outro formato', async () => {
  const dataInvalida = '10/10/2020'

  return pipe(
    dataInvalida,
    dateCodec.decode,
    TE.fromEither,
    mapAll(error =>
      expect(getErrorMessage(error)).toBe('Data inválida, use o formato ISO 8601'),
    ),
  )()
})

it('Deveria retornar um erro quando o date for inválido', async () => {
  const dataInvalida = '2020-01-01T00:00:00.000'

  return pipe(
    dataInvalida,
    dateCodec.decode,
    TE.fromEither,
    mapAll(error =>
      expect(getErrorMessage(error)).toBe('Data inválida, use o formato ISO 8601'),
    ),
  )()
})
