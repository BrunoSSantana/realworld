import { verifyToken } from '@/ports/adapters/jwt/jwt'
export * from '@/ports/fastify/server'

type GetError = {
  errors: string
  context?: string
}

export const getError = ({ errors, context = 'no-context' } : GetError) => {
  return {
    [context]: {
      errors: {
        body: errors.split(':::'),
      },
    },
  }
}

export const getToken = (authorizationHeader: string = '') => {
  const token = authorizationHeader.split(' ')[1] ?? ''

  return verifyToken(token)
}
