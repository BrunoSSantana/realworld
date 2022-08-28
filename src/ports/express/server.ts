import express from 'express'
import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'
import { register } from '@/adapters/use-cases/user/register-adapter'
import { userRegister } from '@/adapters/ports/db'

const app = express()
const PORT = process.env.PORT

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// routes
app.post('/api/users', async (req, res) => {
  return pipe(
    req.body.user,
    register(userRegister),
    TE.map(user => res.status(201).json(user)),
    TE.mapLeft(err => res.status(422).json(getError(err.message)),
    ),
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
