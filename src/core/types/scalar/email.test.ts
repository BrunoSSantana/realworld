import { emailCodec } from './email'
import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'

it('Deveria validar o email corretamente', () => {
  pipe(
    'valid@email.com',
    emailCodec.decode,
    E.map(result => expect(result).toBe('valid@email.com')),
    E.mapLeft(result => expect(result).toBe('valid@email.com')),
  )
})

it('Deveria retornar um erro quando o email for inválido', () => {
  pipe(
    'bruno-bruno.com',
    emailCodec.decode,
    E.mapLeft(error => expect(error[0]?.message).toBe('Email inválido')),
  )
})
