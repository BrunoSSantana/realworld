import * as jwt from '@/ports/jwt/jose'

export const generateToken = (payload: any) => jwt.createJwt(payload)
