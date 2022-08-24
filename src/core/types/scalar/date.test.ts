import { dateCodec } from './date'
import { pipe } from 'fp-ts/lib/function'
import { mapAllE } from '@/config/fixtures'

it('Deveria validar o date corretamente', () => {
  const data = new Date().toISOString()

  pipe(
    data,
    dateCodec.decode,
    mapAllE(result => expect(result).toBe(data)),
  )
})

it('Deveria retornar um erro quando o date for inválido', () => {
  const dataInvalida = '2020-01-01T00:00:00.000'
  pipe(
    dataInvalida,
    dateCodec.decode,
    mapAllE(error => {
      const errorMessage = Array.isArray(error) ? error[0]?.message : ''
      expect(errorMessage).toBe('Data inválida, use o formato ISO 8601')
    }),
  )
})
