import * as jwt from '@/ports/jwt/jose'

type JWTPayload = {
  [propName: string]: unknown
}

export const generateToken = (...args: [JWTPayload, string?]) => jwt.createJwt(...args)

export const verifyToken = async (token: string) => {
  const { payload } = await jwt.verifyJwt(token)

  return payload
}