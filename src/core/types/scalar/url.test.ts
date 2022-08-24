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
      if (Array.isArray(error)) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(error[0]?.message).toBe('Url inválida')
      }
    }),
  )
})
