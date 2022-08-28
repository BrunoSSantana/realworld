import { mapAll } from '@/config/fixtures'
import { CreateArticle } from '@/core/types/article'
import { pipe } from 'fp-ts/lib/function'
import { OutsideRegister, registerArticle } from './register-article'

const data: CreateArticle = {
  title: 'title',
  description: 'description',
  body: 'body',
}

const registerOk: OutsideRegister<string> = async (data: CreateArticle) => {
  return `Article ${data.title} registered`
}

it('Deve criar um artigo', async () => {
  return pipe(
    data,
    registerArticle(registerOk),
    mapAll(result => expect(result).toBe(`Article ${data.title} registered`)),
  )()
})
