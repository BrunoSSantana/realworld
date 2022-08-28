import { CreateUser } from '@/core/types/user'
import { OutsideRegister, register } from './register-user'
import { pipe } from 'fp-ts/lib/function'
import { mapAll, unsafeEmail, unsafePassword, unsafeSlug } from '@/config/fixtures'

const registerOk: OutsideRegister<string> = async (data) => {
  return `Usuário ${data.username} cadastrado com sucesso!`
}

const registerFail: OutsideRegister<never> = async () => {
  throw new Error('External Error')
}

const data: CreateUser = {
  username: unsafeSlug('teste'),
  email: unsafeEmail('teste@teste.com'),
  password: unsafePassword('User123@'),
}

const dataWithWrongUsername: CreateUser = {
  username: unsafeSlug('a'),
  email: unsafeEmail('teste@teste.com'),
  password: unsafePassword('User123@'),
}
const dataWithWrongEmail: CreateUser = {
  username: unsafeSlug('user-valid'),
  email: unsafeEmail('emailinvalid.com'),
  password: unsafePassword('User123@'),
}
const dataWithWrongPassword: CreateUser = {
  username: unsafeSlug('user-valid'),
  email: unsafeEmail('email@valid.com'),
  password: unsafePassword('frac@'),
}
const dataWithWrongEmailPassword: CreateUser = {
  username: unsafeSlug('user-valid'),
  email: unsafeEmail('emailinvalid.com'),
  password: unsafePassword('frac@'),
}

it('Deveria cadastrar um usuário com sucesso', async () => {
  return pipe(
    data,
    register(registerOk),
    mapAll(result => expect(result).toBe(`Usuário ${data.username} cadastrado com sucesso!`)),
  )()
})

it('Não deveria cadastrar um usuário com usuário inválido', async () => {
  return pipe(
    dataWithWrongUsername,
    register(registerOk),
    mapAll(error =>
      expect(error).toEqual(
        new Error('Slug inválido, use apenas letras minúsculas, números e traços com 3 ou mais caracteres'),
      ),
    ),
  )()
})

it('Não deveria cadastrar um usuário com email inválido', async () => {
  return pipe(
    dataWithWrongEmail,
    register(registerOk),
    mapAll(error => expect(error).toEqual(new Error('Email inválido'))),
  )()
})

it('Não deveria cadastrar um usuário com senha inválido', async () => {
  return pipe(
    dataWithWrongPassword,
    register(registerOk),
    mapAll(error => expect(error).toEqual(new Error('A Senha deve ter 8 ou mais caracteres'))),
  )()
})

it('Não deveria cadastrar um usuário com email e senha inválido', async () => {
  return pipe(
    dataWithWrongEmailPassword,
    register(registerOk),
    mapAll(error =>
      expect(error).toEqual(
        new Error('Email inválido:::A Senha deve ter 8 ou mais caracteres'),
      ),
    ),
  )()
})

it('Deveria lançar um erro ao tentar cadastrar um usuário', async () => {
  return pipe(
    data,
    register(registerFail),
    mapAll(error => expect(error).toEqual(new Error('External Error'))),
  )()
})
