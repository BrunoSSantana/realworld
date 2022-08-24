import { emailCodec } from './email'
import { pipe } from 'fp-ts/lib/function'
import { mapAllE } from '@/config/fixtures'

it('Deveria validar o email corretamente', () => {
  pipe(
    'valid@email.com',
    emailCodec.decode,
    mapAllE(result => expect(result).toBe('valid@email.com')),
  )
})

it('Deveria retornar um erro quando o email for inválido', () => {
  pipe(
    'bruno-bruno.com',
    emailCodec.decode,
    mapAllE(error => {
      const errorMessage = Array.isArray(error) ? error[0]?.message : ''
      expect(errorMessage).toBe('Email inválido')
    }),
  )
})
