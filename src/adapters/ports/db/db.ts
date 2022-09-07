import {
  outsideAddCommentToAnArticle,
  outsideRegister,
  outsideRegisterArticle,
} from '@/ports/db-in-memory/db'
import { OutsideRegisterUserType } from '@/adapters/use-cases/user/register-user-adapter'
import { OutsideRegisterArticleType } from '@/adapters/use-cases/article/register-article-adapter'
import { OutsideCreateCommentType } from '@/adapters/use-cases/article/add-comment-to-article-adapter'

export const createUserInDB: OutsideRegisterUserType = (data) => {
  return outsideRegister(data)
}

export const createArticleInDB: OutsideRegisterArticleType = (data) => {
  return outsideRegisterArticle(data)
}

export const addCommentToAnArticleInDB: OutsideCreateCommentType = (data) => {
  return outsideAddCommentToAnArticle(data)
}
