import { ArticleOutput } from '@/core/article/types/article-types'
import { RegisterArticle, OutsideRegisterArticle as Out } from '@/core/article/use-cases/register-article'

export type OutsideRegisterArticle = Out<{
  article: ArticleOutput
}>

export const registerArticle: RegisterArticle = (outsideRegister) => (data) =>
  registerArticle(outsideRegister)(data)
