import { it, expect } from 'vitest'

import { mapAll, unsafe } from '@/config/fixtures'
import { CreateComment } from '@/core/types/comment'
import { pipe } from 'fp-ts/lib/function'
import { addCommentToAnArticle, OutsideCreateComment } from './create-comment'

const data: CreateComment = {
  body: unsafe('Excelente artigo!'),
  articleSlug: unsafe('como-fazer-um-blog'),
  authorId: unsafe('c0d3b4c3-0f0d-4b3c-8d3c-0d3c0d3c0d3c'),
}

const dataWithBodyFail: CreateComment = {
  body: unsafe(''),
  articleSlug: unsafe('como-fazer-um-blog'),
  authorId: unsafe('c0d3b4c3-0f0d-4b3c-8d3c-0d3c0d3c0d3c'),
}
const dataWithSlugFail: CreateComment = {
  body: unsafe('any body not empity to create comment'),
  articleSlug: unsafe('FailSlug'),
  authorId: unsafe('c0d3b4c3-0f0d-4b3c-8d3c-0d3c0d3c0d3c'),
}

const dataWithAuthorIdFail: CreateComment = {
  body: unsafe('any body not empity to create comment'),
  articleSlug: unsafe('como-fazer-um-blog'),
  authorId: unsafe('123-uuid-invalid'),
}

const dataWithAllParamsInvalids: CreateComment = {
  body: unsafe(''),
  articleSlug: unsafe('FailSlug'),
  authorId: unsafe('123-uuid-invalid'),
}

const errorInvalidSlugMessage = 'Slug inválido, use apenas letras minúsculas, números e traços com 3 ou mais caracteres'
const errorInvalidAuthorIdMessage = 'authorId must be a valid UUID'
const errorInvalidBodyMessage = 'O comentário não pode ser vazio'

const registerOk: OutsideCreateComment<string> = async (data) => {
  return `Comentário registrado com sucesso: ${data.body}`
}

const registerFail: OutsideCreateComment<never> = async () => {
  throw new Error('External error!')
}

it('Deveria adicionar um comentário a um Artigo', async () => {
  return pipe(
    data,
    addCommentToAnArticle(registerOk),
    mapAll(result => expect(result).toEqual(`Comentário registrado com sucesso: ${data.body}`)),
  )()
})

it('Não deveria adicionar um comentário com body inválido', async () => {
  return pipe(
    dataWithBodyFail,
    addCommentToAnArticle(registerOk),
    mapAll(result => expect(result).toEqual(new Error(errorInvalidBodyMessage))),
  )()
})

it('Não deveria adicionar um comentário com slug inválido', async () => {
  return pipe(
    dataWithSlugFail,
    addCommentToAnArticle(registerOk),
    mapAll(result => expect(result).toEqual(new Error(errorInvalidSlugMessage))),
  )()
})

it('Não deveria adicionar um comentário com authorId inválido', async () => {
  return pipe(
    dataWithAuthorIdFail,
    addCommentToAnArticle(registerOk),
    mapAll(result => expect(result).toEqual(new Error(errorInvalidAuthorIdMessage))),
  )()
})

it('Não deveria adicionar um comentário com todos os parâmetros inválidos', async () => {
  return pipe(
    dataWithAllParamsInvalids,
    addCommentToAnArticle(registerOk),
    mapAll(result => expect(result).toEqual(new Error([errorInvalidAuthorIdMessage, errorInvalidSlugMessage, errorInvalidBodyMessage].join(':::')))),
  )()
})

it('Deveria registar um comment se o outsideRegister retornar um erro', async () => {
  return pipe(
    data,
    addCommentToAnArticle(registerFail),
    mapAll(result => expect(result).toEqual(new Error('External error!'))),
  )()
})
