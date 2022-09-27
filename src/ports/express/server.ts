import express from 'express'
import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'
import { env } from '@/helper'
import * as db from '@/adapters/ports/db'
import { registerUser } from '@/adapters/use-cases/user/register-user-adapter'
import { registerArticle } from '@/adapters/use-cases/article/register-article-adapter'
import { addCommentToAnArticle } from '@/adapters/use-cases/article/add-comment-to-article-adapter'
import { verifyToken } from '@/adapters/ports/jwt/jwt'

const app = express()
const PORT = env('PORT')

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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

// routes

// public
app.post('/api/users', async (req, res) => {
  return pipe(
    req.body.user,
    registerUser(db.createUserInDB),
    TE.map(user => res.status(201).json(user)),
    TE.mapLeft(err => res.status(422).json(getError(err.message)),
    ),
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
    registerArticle(db.createArticleInDB),
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
    addCommentToAnArticle(db.addCommentToAnArticleInDB),
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
