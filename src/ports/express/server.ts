import express from 'express'
import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'
import { registerUser } from '@/adapters/use-cases/user/register-user-adapter'
import { createArticleInDB, createUserInDB } from '@/adapters/ports/db'
import { registerArticle } from '@/core/use-cases/article/register-article'
import { env } from '@/helper'

const app = express()
const PORT = env('PORT')

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// routes

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

// private
app.post('/api/articles', async (req, res) => {
  return pipe(
    req.body.article,
    registerArticle(createArticleInDB),
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
