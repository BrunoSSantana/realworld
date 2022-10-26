import * as jwt from '@/ports/jwt/jose'
import { AuthorIdOutPut } from '@/core/article/types/article-types'

export type JWTPayload = {
  id: AuthorIdOutPut
}
export const generateToken = (...args: [JWTPayload, string?]) =>
  jwt.createJwt(...args)

export const verifyToken = async (token: string) => {
  const { payload } = await jwt.verifyJwt(token)

  return payload
}
