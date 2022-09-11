import { env } from '@/helper'
import { JWTPayload, jwtVerify, SignJWT } from 'jose'

// TODO: garantir que o secret tenha ao menos 32 chars
const JWT_SECRET = env('JWT_SECRET')

export async function createJwt (payload: JWTPayload) {
  const secret = Buffer.from(JWT_SECRET)

  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('10m')
    .sign(secret)
}

export async function verifyJwt (token: string) {
  const secret = Buffer.from(JWT_SECRET)

  return jwtVerify(token, secret)
}
