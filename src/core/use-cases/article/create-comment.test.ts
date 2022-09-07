import { mapAll, unsafe } from '@/config/fixtures'
import { CreateComment } from '@/core/types/comment'
import { pipe } from 'fp-ts/lib/function'
import { addCommentToArticle, OutsideCreateComment } from './create-comment'

const data: CreateComment = {
  body: unsafe('Excelente artigo!'),
}

const dataFail: CreateComment = {
  body: unsafe(''),
}

const registerOk: OutsideCreateComment<string> = async (data) => {
  return `Comentário registrado com sucesso: ${data.body}`
}

const registerFail: OutsideCreateComment<never> = async () => {
  throw new Error('External error!')
}

it('Deveria adicionar um comentário a um Artigo', async () => {
  return pipe(
    data,
    addCommentToArticle(registerOk),
    mapAll(result => expect(result).toEqual(`Comentário registrado com sucesso: ${data.body}`)),
  )()
})

it('Não deveria adicionar um comentário vazio', async () => {
  return pipe(
    dataFail,
    addCommentToArticle(registerOk),
    mapAll(result => expect(result).toEqual(new Error('O comentário não pode ser vazio'))),
  )()
})

it('Deveria registar um comment se o outsideRegister retornar um erro', async () => {
  return pipe(
    data,
    addCommentToArticle(registerFail),
    mapAll(result => expect(result).toEqual(new Error('External error!'))),
  )()
})
