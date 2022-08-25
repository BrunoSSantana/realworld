import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'
import { getErrorMessage, mapAll } from '@/config/fixtures'
import { slugCodec } from './slug'

it('Deveria validar o slug corretamente', async () => {
  const slug = 'minha-slug-from-test'

  return pipe(
    slug,
    slugCodec.decode,
    TE.fromEither,
    mapAll(result => expect(result).toBe(slug)),
  )()
})

it('Deveria retornar um erro quando o slug iniciar o traço', async () => {
  const slugInvalid = '-123'

  return pipe(
    slugInvalid,
    slugCodec.decode,
    TE.fromEither,
    mapAll(error =>
      expect(getErrorMessage(error)).toBe('Slug inválido, use apenas letras, números e traços'),
    ),
  )()
})

it('Deveria retornar um erro quando o slug iniciar número', async () => {
  const slugInvalid = '1-slug'

  return pipe(
    slugInvalid,
    slugCodec.decode,
    TE.fromEither,
    mapAll(error =>
      expect(getErrorMessage(error)).toBe('Slug inválido, use apenas letras, números e traços'),
    ),
  )()
})

it('Deveria retornar um erro quando o slug finalizar com traço', async () => {
  const slugInvalid = 'slug-incorrect-'

  return pipe(
    slugInvalid,
    slugCodec.decode,
    TE.fromEither,
    mapAll(error =>
      expect(getErrorMessage(error)).toBe('Slug inválido, use apenas letras, números e traços'),
    ),
  )()
})

it('Deveria retornar um erro quando o slug possuir letras maiúsculas', async () => {
  const slugInvalid = 'SlugIncorrect'

  return pipe(
    slugInvalid,
    slugCodec.decode,
    TE.fromEither,
    mapAll(error =>
      expect(getErrorMessage(error)).toBe('Slug inválido, use apenas letras, números e traços'),
    ),
  )()
})

it('Deveria aceitar um slug com menos de 3 caracteres', async () => {
  const slugInvalid = 'ok'

  return pipe(
    slugInvalid,
    slugCodec.decode,
    TE.fromEither,
    mapAll(error =>
      expect(getErrorMessage(error)).toBe('Slug inválido, use apenas letras, números e traços'),
    ),
  )()
})

it('Deveria aceitar um slug com 3 caracteres', async () => {
  const slug = 'vai'

  return pipe(
    slug,
    slugCodec.decode,
    TE.fromEither,
    mapAll(result => expect(result).toBe(slug)),
  )()
})
