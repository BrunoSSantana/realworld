import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'
import { getErrorMessage, mapAll } from '@/config/fixtures'
import { urlCodec } from './url'

it('Deveria validar o url corretamente', async () => {
  const url = 'https://www.google.com'

  return pipe(
    url,
    urlCodec.decode,
    TE.fromEither,
    mapAll(result => expect(result).toBe(url)),
  )()
})

it('Deveria retornar um erro quando o url for inválido', () => {
  const urlInvalid = 'wwwgoogle.com'

  return pipe(
    urlInvalid,
    urlCodec.decode,
    TE.fromEither,
    mapAll(error => expect(getErrorMessage(error)).toBe('Url inválida'),
    ),
  )()
})
