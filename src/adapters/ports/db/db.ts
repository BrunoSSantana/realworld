import { OutsideRegisterType } from '@/adapters/use-cases/user/register-user-adapter'
import { OutsideRegisterType as OutsideRegisterArticle } from '@/adapters/use-cases/article/register-article-adapter'
import { outsideRegister, outsideRegisterArticle } from '@/ports/db-in-memory/db'

export const userRegister: OutsideRegisterType = (data) => {
  return outsideRegister(data)
}

export const articleRegister: OutsideRegisterArticle = (data) => {
  return outsideRegisterArticle(data)
}
