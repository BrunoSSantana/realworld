import express from 'express'
import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'
import { env } from '@/helper'
import * as db from '@/adapters/ports/db'
import { registerUser } from '@/adapters/use-cases/user/register-user-adapter'
import { registerArticle } from '@/adapters/use-cases/article/register-article-adapter'
import { addCommentToAnArticle } from '@/adapters/use-cases/article/add-comment-to-article-adapter'

const app = express()
const PORT = env('PORT')

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.disable('x-powered-by')
app.disable('etag') // header de tag é responsável por cache

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
app.post('/api/articles', async (req, res) => {
  return pipe(
    req.body.article,
    registerArticle(db.createArticleInDB),
    TE.map(article => res.status(201).json(article)),
    TE.mapLeft(err => res.status(422).json(getError(err.message))),
  )()
})

app.post('/api/articles/:slug/comment', async (req, res) => {
  return pipe(
    req.body.comment,
    addCommentToAnArticle(db.addCommentToAnArticleInDB),
    TE.map(article => res.status(201).json(article)),
    TE.mapLeft(err => res.status(422).json(getError(err.message))),
  )()
})

// start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})

function getError (erros: string) {
  return {
    errors: {
      body: erros.split(':::'),
    },
  }
}
