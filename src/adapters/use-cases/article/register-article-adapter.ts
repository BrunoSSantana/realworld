import { ArticleOutput } from '@/core/types/article'
import * as article from '@/core/use-cases/article/register-article'

export type OutsideRegisterArticle = article.OutsideRegisterArticle<{
  article: ArticleOutput
}>

export const registerArticle: article.RegisterArticle = (outsideRegister) => (data) =>
  article.registerArticle(outsideRegister)(data)
