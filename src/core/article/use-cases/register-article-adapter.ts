import { ArticleOutput } from '@/core/article/types/article-types'
import {
  RegisterArticle,
  OutsideRegisterArticle as Out,
  registerArticle as register,
} from '@/core/article/use-cases/register-article'

export type OutsideRegisterArticle = Out<{
  article: ArticleOutput
}>

export const registerArticle: RegisterArticle = (outsideRegister) => (data) =>
  register(outsideRegister)(data)
