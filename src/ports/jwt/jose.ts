import { env } from '@/helper'
import { JWTPayload, jwtVerify, SignJWT } from 'jose'

// TODO: garantir que o secret tenha ao menos 32 chars
const JWT_SECRET = env('JWT_SECRET')

if (JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET precisa ter 32 ou mais caracteres')
}

export async function createJwt (
  payload: JWTPayload,
  expirationTime: string = '10m',
) {
  const secret = Buffer.from(JWT_SECRET)

  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(expirationTime)
    .sign(secret)
}

export async function verifyJwt (token: string) {
  const secret = Buffer.from(JWT_SECRET)

  return jwtVerify(token, secret)
}
