import express from 'express'
import cors from 'cors'
import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'

import { env, getError } from '@/helper'

import { verifyToken } from '@/ports/adapters/jwt/jwt'
import { httpLogin, httpRegisterUser } from '@/ports/adapters/http/modules/user'
import { httpAddCommentToAnArticle, httpRegisterArticle } from '@/ports/adapters/http/modules/article'

const app = express()
const PORT = env('PORT')

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.disable('x-powered-by')
app.disable('etag') // header de tag é responsável por cache

const auth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json(getError({ errors: 'Unauthorized', context: 'auth' }))
    }

    const decoded = await verifyToken(token)

    if (decoded) {
      const propUser = 'user'
      res.locals[propUser] = decoded

      return next()
    }

    return res.status(401).json(getError({ errors: 'Unauthorized', context: 'auth' }))
  } catch {
    return res.status(401).json(getError({ errors: 'Forbiden', context: 'auth' }))
  }
}

// ROUTES

// public
app.post('/api/users', async (req, res) => {
  return pipe(
    req.body.user,
    httpRegisterUser,
    TE.map(user => res.status(201).json(user)),
    TE.mapLeft(err => res.status(422).json(err),
    ),
  )()
})

app.post('/api/users/login', async (req, res) => {
  return pipe(
    req.body.user,
    httpLogin,
    TE.map(result => res.json(result)),
    TE.mapLeft(error => res.status(422).json(error)),
  )()
})

// private
app.post('/api/articles', auth, async (req, res) => {
  const propUser = 'user'
  const idProp = 'id'

  const payload = res.locals[propUser]

  const data = {
    ...req.body.article,
    authorId: payload[idProp],
  }

  return pipe(
    data,
    httpRegisterArticle,
    TE.map(article => res.status(201).json(article)),
    TE.mapLeft(err => res.status(422).json(err)),
  )()
})

app.post('/api/articles/:slug/comment', auth, async (req, res) => {
  const propUser = 'user'
  const propSlug = 'slug'
  const payload = res.locals[propUser]

  const data = {
    ...req.body.comment,
    authorId: payload.id,
    articleSlug: req.params[propSlug],
  }

  return pipe(
    data,
    httpAddCommentToAnArticle,
    TE.map(commentToAnArticle => res.status(201).json(commentToAnArticle)),
    TE.mapLeft(err => res.status(422).json(err)),
  )()
})

// start server

export const start = () => {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
  })
}
