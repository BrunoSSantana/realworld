import { CreateUser } from '@/core/types/user'
import { OutsideRegister, registerUser } from './register-user'
import { pipe } from 'fp-ts/lib/function'
import { mapAll, unsafe } from '@/config/fixtures'

const registerOk: OutsideRegister<string> = async (data) => {
  return `Usuário ${data.username} cadastrado com sucesso!`
}

const registerFail: OutsideRegister<never> = async () => {
  throw new Error('External Error')
}

const data: CreateUser = {
  username: unsafe('teste'),
  email: unsafe('teste@teste.com'),
  password: unsafe('User123@'),
}

const dataWithWrongUsername: CreateUser = {
  username: unsafe('a'),
  email: unsafe('teste@teste.com'),
  password: unsafe('User123@'),
}
const dataWithWrongEmail: CreateUser = {
  username: unsafe('user-valid'),
  email: unsafe('emailinvalid.com'),
  password: unsafe('User123@'),
}
const dataWithWrongPassword: CreateUser = {
  username: unsafe('user-valid'),
  email: unsafe('email@valid.com'),
  password: unsafe('frac@'),
}
const dataWithWrongEmailPassword: CreateUser = {
  username: unsafe('user-valid'),
  email: unsafe('emailinvalid.com'),
  password: unsafe('frac@'),
}

it('Deveria cadastrar um usuário com sucesso', async () => {
  return pipe(
    data,
    registerUser(registerOk),
    mapAll(result => expect(result).toBe(`Usuário ${data.username} cadastrado com sucesso!`)),
  )()
})

it('Não deveria cadastrar um usuário com usuário inválido', async () => {
  return pipe(
    dataWithWrongUsername,
    registerUser(registerOk),
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
    registerUser(registerOk),
    mapAll(error => expect(error).toEqual(new Error('Email inválido'))),
  )()
})

it('Não deveria cadastrar um usuário com senha inválido', async () => {
  return pipe(
    dataWithWrongPassword,
    registerUser(registerOk),
    mapAll(error => expect(error).toEqual(new Error('A Senha deve ter 8 ou mais caracteres'))),
  )()
})

it('Não deveria cadastrar um usuário com email e senha inválido', async () => {
  return pipe(
    dataWithWrongEmailPassword,
    registerUser(registerOk),
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
    registerUser(registerFail),
    mapAll(error => expect(error).toEqual(new Error('External Error'))),
  )()
})
