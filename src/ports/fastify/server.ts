import fastify, {
  FastifyReply,
  HookHandlerDoneFunction,
  RouteShorthandOptions,
  FastifyRequest,
  RouteGenericInterface,
  RawServerDefault,
} from 'fastify'

import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'

import { env, getError } from '@/helper'

import { httpLogin, httpRegisterUser } from '@/ports/adapters/http/modules/user'
import { httpRegisterArticle } from '@/ports/adapters/http/modules/article'

import { ApiCreateArticle, ApiUserCreate, ApiUserLogin } from './types'
import { verifyToken } from '../adapters/jwt/jwt'
import http from 'http'
import { AuthorId, CreateArticle } from '@/core/article/types/article-types'
import { JWTPayload } from 'jose'

// SETUP
type CustomRequest = http.IncomingMessage & {
  auth?: JWTPayload
}

type AuthPreValidation = (
  req: FastifyRequest<RouteGenericInterface, RawServerDefault, CustomRequest>,
  reply: FastifyReply,
  done: HookHandlerDoneFunction,
) => void

export const app = fastify<http.Server, CustomRequest>({ logger: true })

// MIDDLEWARES

const auth: AuthPreValidation = async (req, reply, done) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] ?? ''
    const payload = await verifyToken(token)

    req.raw.auth = payload
    return done()
  } catch {
    return reply.status(401).send(getError('Forbiden'))
  }
}

const options: RouteShorthandOptions = {
  preValidation: auth,
}

const PORT = env<number>('PORT')

// ROUTES
app.post<ApiUserCreate>('/api/users', async (req, reply) => {
  return pipe(
    req.body.user,
    httpRegisterUser,
    TE.map(user => reply.status(201).send(user)),
    TE.mapLeft(err => reply.status(422).send(err),
    ),
  )()
})

app.post<ApiUserLogin>('/api/users/login', async (req, reply) => {
  return pipe(
    req.body.user,
    httpLogin,
    TE.map(resultLogin => reply.status(201).send(resultLogin)),
    TE.mapLeft(err => reply.status(422).send(err),
    ),
  )()
})

app.post<ApiCreateArticle>('/api/articles', options, async (req, reply) => {
  const payload = req.raw.auth
  const propId = 'id'

  if (!payload) {
    return reply.status(401).send('Unauthorized')
  }

  const data: CreateArticle = {
    ...req.body.article,
    // TODO: Remove type assertion
    authorId: payload[propId] as AuthorId,
  }

  return pipe(
    data,
    httpRegisterArticle,
    TE.map(article => reply.status(201).send(article)),
    TE.mapLeft(err => reply.status(422).send(err)),
  )()
})

export const start = async () => {
  try {
    await app.listen({ port: PORT })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}
