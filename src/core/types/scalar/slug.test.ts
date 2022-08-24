import { slugCodec } from './slug'
import { pipe } from 'fp-ts/lib/function'
import { mapAllE } from '@/config/fixtures'

it('Deveria validar o slug corretamente', () => {
  const slug = 'minha-slug-from-test'

  pipe(
    slug,
    slugCodec.decode,
    mapAllE(result => expect(result).toBe(slug)),
  )
})

it('Deveria retornar um erro quando o slug iniciar o traço', () => {
  const slugInvalid = '-123'

  pipe(
    slugInvalid,
    slugCodec.decode,
    mapAllE(error => {
      const errorMessage = Array.isArray(error) ? error[0]?.message : ''
      expect(errorMessage).toBe('Slug inválido, use apenas letras, números e traços')
    }),
  )
})

it('Deveria retornar um erro quando o slug iniciar número', () => {
  const slugInvalid = '1-slug'

  pipe(
    slugInvalid,
    slugCodec.decode,
    mapAllE(error => {
      const errorMessage = Array.isArray(error) ? error[0]?.message : ''
      expect(errorMessage).toBe('Slug inválido, use apenas letras, números e traços')
    }),
  )
})

it('Deveria retornar um erro quando o slug finalizar com traço', () => {
  const slugInvalid = 'slug-incorrect-'

  pipe(
    slugInvalid,
    slugCodec.decode,
    mapAllE(error => {
      const errorMessage = Array.isArray(error) ? error[0]?.message : ''
      expect(errorMessage).toBe('Slug inválido, use apenas letras, números e traços')
    }),
  )
})

it('Deveria retornar um erro quando o slug possuir letras maiúsculas', () => {
  const slugInvalid = 'SlugIncorrect'

  pipe(
    slugInvalid,
    slugCodec.decode,
    mapAllE(error => {
      const errorMessage = Array.isArray(error) ? error[0]?.message : ''
      expect(errorMessage).toBe('Slug inválido, use apenas letras, números e traços')
    }),
  )
})

it('Deveria aceitar um slug com menos de 3 caracteres', () => {
  const slugInvalid = 'ok'

  pipe(
    slugInvalid,
    slugCodec.decode,
    mapAllE(error => {
      const errorMessage = Array.isArray(error) ? error[0]?.message : ''
      expect(errorMessage).toBe('Slug inválido, use apenas letras, números e traços')
    }),
  )
})

it('Deveria aceitar um slug com 3 caracteres', () => {
  const slug = 'vai'

  pipe(
    slug,
    slugCodec.decode,
    mapAllE(result => expect(result).toBe(slug)),
  )
})
