import { ArticleOutput } from '@/core/types/article'
import { OutsideRegister, RegisterArticle, registerArticle as registerArticleCore } from '@/core/use-cases/article/register-article'

export type OutsideRegisterArticleType = OutsideRegister<{
  article: ArticleOutput
}>

export const registerArticle: RegisterArticle = (outsideRegister) => (data) =>
  registerArticleCore(outsideRegister)(data)
