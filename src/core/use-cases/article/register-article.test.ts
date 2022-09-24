import { it, expect } from 'vitest'

import { mapAll, unsafe } from '@/config/fixtures'
import { CreateArticle } from '@/core/types/article'
import { pipe } from 'fp-ts/lib/function'
import { OutsideRegisterArticle, registerArticle } from './register-article'

const data: CreateArticle = {
  title: 'Article title',
  description: 'Article Description',
  body: 'Article Body',
  authorId: unsafe('2c9c1f6b-3ba3-4ecf-bd61-2fb25b2a8b99'),
}

const dataWithTagList: CreateArticle = {
  ...data,
  tagList: ['tag1', 'tag2'].map((tag) => unsafe(tag)),
}

const dataWithInvalidTagList: CreateArticle = {
  ...data,
  tagList: ['Tag1', '1ag2'].map((tag) => unsafe(tag)),
}

const dataWithInvalidTitle: CreateArticle = {
  ...data,
  title: unsafe(1),
}

const dataWithInvalidAuthorID: CreateArticle = {
  ...data,
  authorId: unsafe('123-invalid-id'),
}

const registerOk: OutsideRegisterArticle<string> = async (data: CreateArticle) => {
  return `Article ${data.title} registered`
}

const registerFail: OutsideRegisterArticle<never> = async () => {
  throw new Error('External error!')
}

it('Deve criar um artigo', async () => {
  return pipe(
    data,
    registerArticle(registerOk),
    mapAll(result => expect(result).toBe(`Article ${data.title} registered`)),
  )()
})

it('Não deve criar um artigo ao falahar a função de outsideRegister', async () => {
  return pipe(
    data,
    registerArticle(registerFail),
    mapAll(error => expect(error).toEqual(new Error('External error!'))),
  )()
})

it('Deve criar um artigo com uma lista de tags', async () => {
  return pipe(
    dataWithTagList,
    registerArticle(registerOk),
    mapAll(result => expect(result).toBe(`Article ${dataWithTagList.title} registered`)),
  )()
})

it('Não deve criar um artigo ao passar tags inválidas', async () => {
  return pipe(
    dataWithInvalidTagList,
    registerArticle(registerOk),
    mapAll(error => {
      expect(error).toEqual(new Error('Slug inválido, use apenas letras minúsculas, números e traços com 3 ou mais caracteres:::Slug inválido, use apenas letras minúsculas, números e traços com 3 ou mais caracteres'))
    }),
  )()
})

it('Não deve criar um artigo com title inválido', async () => {
  return pipe(
    dataWithInvalidTitle,
    registerArticle(registerOk),
    mapAll(error => expect(error).toEqual(new Error('Invalid title'))),
  )()
})

it('Não deve criar um artigo com um authorID inválido', async () => {
  return pipe(
    dataWithInvalidAuthorID,
    registerArticle(registerOk),
    mapAll(error => expect(error).toEqual(new Error('Invalid authorId'))),
  )()
})
