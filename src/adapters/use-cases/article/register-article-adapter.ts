import { Article } from '@/core/types/article'
import { OutsideRegister, RegisterArticle, registerArticle as registerArticleCore } from '@/core/use-cases/article/register-article'

export type OutsideRegisterType = OutsideRegister<{
  article: Article
}>

export const registerArticle: RegisterArticle = (outsideRegister) => (data) =>
  registerArticleCore(outsideRegister)(data)
