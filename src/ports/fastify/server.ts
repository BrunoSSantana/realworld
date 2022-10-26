import fastify, {
  FastifyReply,
  HookHandlerDoneFunction,
  RouteShorthandOptions,
  FastifyRequest,
  RouteGenericInterface,
  RawServerDefault,
} from 'fastify'
import http from 'http'

import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'

import { env } from '@/helper'

import {
  AddCommentApi,
  ApiCreateArticle,
  ApiUserCreate,
  ApiUserLogin,
} from '@/ports/fastify/types'

import {
  httpGetCurrentUser,
  httpLogin,
  httpRegisterUser,
} from '@/ports/adapters/http/modules/user'
import {
  httpAddCommentToAnArticle,
  httpRegisterArticle,
} from '@/ports/adapters/http/modules/article'
import { getError, getToken } from '@/ports/adapters/http/http'
import { JWTPayload } from '@/ports/adapters/jwt/jwt'

import { AuthorId, CreateArticle } from '@/core/article/types/article-types'

// SETUP
type CustomRequest = http.IncomingMessage & {
  auth?: JWTPayload;
};

type AuthPreValidation = (
  req: FastifyRequest<RouteGenericInterface, RawServerDefault, CustomRequest>,
  reply: FastifyReply,
  done: HookHandlerDoneFunction
) => void;

const PORT = env<number>('PORT')

export const app = fastify<http.Server, CustomRequest>({ logger: true })

// MIDDLEWARES

const auth: AuthPreValidation = async (req, reply, done) => {
  try {
    const payload = await getToken(req.headers.authorization)

    req.raw.auth = payload as JWTPayload
    return done()
  } catch {
    return reply
      .status(401)
      .send(getError({ errors: 'Forbiden', context: 'auth' }))
  }
}

const authOptions: RouteShorthandOptions = {
  preValidation: auth,
}

// ROUTES

// Users
// create
app.post<ApiUserCreate>('/api/users', async (req, reply) => {
  return pipe(
    req.body.user,
    httpRegisterUser,
    TE.map((user) => reply.status(201).send(user)),
    TE.mapLeft((err) => reply.status(422).send(err)),
  )()
})
// login
app.post<ApiUserLogin>('/api/users/login', async (req, reply) => {
  return pipe(
    req.body.user,
    httpLogin,
    TE.map((resultLogin) => reply.status(201).send(resultLogin)),
    TE.mapLeft((err) => reply.status(422).send(err)),
  )()
})

app.get<ApiUserLogin>('/api/user', authOptions, async (req, reply) => {
  const payload = req.raw.auth as any
  const token = req.headers.authorization?.split(' ')[1] ?? ''

  const user = await httpGetCurrentUser(payload, token)

  return reply.send(user)
})

// list
app.get('/api/users', async (_req, reply) => {
  reply.send(['oi'])
})

// detail
app.get('/api/users/:id', async (_req, reply) => {
  reply.status(200).send({ a: 'b' })
})

// Article
app.post<ApiCreateArticle>('/api/articles', authOptions, async (req, reply) => {
  const payload = req.raw.auth
  const propId = 'id'

  if (!payload) {
    return reply.status(401).send('Unauthorized')
  }

  const data: CreateArticle = {
    ...req.body.article,
    authorId: payload[propId] as AuthorId,
  }

  return pipe(
    data,
    httpRegisterArticle,
    TE.map((article) => reply.status(201).send(article)),
    TE.mapLeft((err) => reply.status(422).send(err)),
  )()
})

app.post<AddCommentApi>(
  '/api/articles/:slug/comments',
  authOptions,
  async (req, reply) => {
    const payload = req.raw.auth
    const idProp = 'id'
    const slugProp = 'slug'

    const data = {
      ...req.body.comment,
      authorId: payload?.[idProp] as AuthorId,
      articleSlug: req.params[slugProp],
    }

    return pipe(
      data,
      httpAddCommentToAnArticle,
      TE.map((commentToAnArticle) =>
        reply.status(201).send(commentToAnArticle),
      ),
      TE.mapLeft((err) => reply.status(422).send(err)),
    )()
  },
)

export const start = async () => {
  try {
    await app.listen({ port: PORT })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}
