import { urlCodec } from './url'
import { pipe } from 'fp-ts/lib/function'
import { mapAllE } from '@/config/fixtures'

it('Deveria validar o url corretamente', () => {
  const url = 'https://www.google.com'
  pipe(
    url,
    urlCodec.decode,
    mapAllE(result => expect(result).toBe(url)),
  )
})

it('Deveria retornar um erro quando o url for inválido', () => {
  const urlInvalid = 'wwwgoogle.com'
  pipe(
    urlInvalid,
    urlCodec.decode,
    mapAllE(error => {
      const errorMessage = Array.isArray(error) ? error[0]?.message : ''
      expect(errorMessage).toBe('Url inválida')
    }),
  )
})
