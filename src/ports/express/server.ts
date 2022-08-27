import express from 'express'
import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'
import { OutsideRegisterType, register } from '@/adapters/user/register-adapter'

const app = express()
const PORT = 3333

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// outside faker
const outsideRegister: OutsideRegisterType = async (data) => {
  return {
    sucess: true,
    data,
  }
}

// routes
app.post('/api/users', async (req, res) => {
  return pipe(
    req.body.user,
    register(outsideRegister),
    TE.map(user => res.status(201).json(user)),
    TE.mapLeft(err => res.status(400).json({ status: 400, message: err.message }),
    ),
  )()
})

// start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
