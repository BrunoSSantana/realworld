import express from 'express'
import cors from 'cors'
import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'
import * as E from 'fp-ts/lib/Either'

import { env } from '@/helper'

import { registerUser } from '@/core/user/use-cases/register-user-adapter'
import { registerArticle } from '@/core/article/use-cases/register-article-adapter'
import { addCommentToAnArticle } from '@/core/article/use-cases/add-comment-to-article-adapter'

import {
  createUserInDB,
  createArticleInDB,
  addCommentToAnArticleInDB,
  login,
} from '@/ports/adapters/db/domains'
import { verifyToken } from '@/ports/adapters/jwt/jwt'

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
      return res.status(401).json(getError('Unauthorized'))
    }

    const decoded = await verifyToken(token)

    if (decoded) {
      const propUser = 'user'
      res.locals[propUser] = decoded

      return next()
    }

    return res.status(401).json(getError('Unauthorized'))
  } catch {
    return res.status(401).json(getError('Forbiden'))
  }
}

// ROUTES

// public
app.post('/api/users', async (req, res) => {
  return pipe(
    req.body.user,
    registerUser(createUserInDB),
    TE.map(user => res.status(201).json(user)),
    TE.mapLeft(err => res.status(422).json(getError(err.message)),
    ),
  )()
})

app.post('/api/users/login', async (req, res) => {
  return pipe(
    TE.tryCatch(
      () => login(req.body.user),
      E.toError,
    ),
    TE.map(result => res.json(result)),
    TE.mapLeft(error => res.status(422).json(getError(error.message))),
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
    registerArticle(createArticleInDB),
    TE.map(article => res.status(201).json(article)),
    TE.mapLeft(err => res.status(422).json(getError(err.message))),
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
    addCommentToAnArticle(addCommentToAnArticleInDB),
    TE.map(article => res.status(201).json(article)),
    TE.mapLeft(err => res.status(422).json(getError(err.message))),
  )()
})

// start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})

const getError = (erros: string) => {
  return {
    errors: {
      body: erros.split(':::'),
    },
  }
}
