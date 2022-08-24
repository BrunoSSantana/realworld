import { CreateUser } from '@/core/types/user'
import { OutsideRegister, register } from './register'
import { pipe } from 'fp-ts/lib/function'
import { mapAll, unsafeEmail } from '@/config/fixtures'

// eslint-disable-next-line jest/no-export
export const registerOk: OutsideRegister<string> = async (data) => {
  return `Usuário ${data.username} cadastrado com sucesso!`
}

// eslint-disable-next-line jest/no-export
export const registerFail: OutsideRegister<never> = async (data) => {
  throw new Error(`Usuário não cadastrado ${data.username}`)
}

const data: CreateUser = {
  username: 'teste',
  email: unsafeEmail('teste@teste.com'),
  password: 'teste',
}

it('Deveria cadastrar um usuário com sucesso', async () => {
  return pipe(
    data,
    register(registerFail),
    mapAll(result => expect(result).toBe(`Usuário ${data.username} cadastrado com sucesso!`)),
  )()
})
