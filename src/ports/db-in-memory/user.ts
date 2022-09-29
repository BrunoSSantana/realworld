import { v4 as uuidv4 } from 'uuid'
import argon2 from 'argon2'

import { CreateUser, LoginUser } from '@/core/user/types/user-types'
import { DBUser } from '@/ports/adapters/db/types'
import { db } from './db'

type CreateUserInDB = (data: CreateUser) => Promise<DBUser>

// outside faker
export const createUserInDB: CreateUserInDB = async (data) => {
  if (db.usersByEmail[data.email]) {
    throw new Error('User already registered')
  }
  const id = uuidv4()

  db.usersByEmail[data.email] = id

  const hashedPassword = await argon2.hash(data.password)

  const user = db.users[id] = {
    id,
    email: data.email,
    username: data.username,
    password: hashedPassword,
  }

  return user
}

type Login = (data: LoginUser) => Promise<DBUser>

export const login: Login = async (data) => {
  const userId = db.usersByEmail[data.email]

  const user = db.users[userId ?? '']

  if (!user || !(await argon2.verify(user.password, data.password))) {
    throw new Error('Invalid Email or Password')
  }

  return user
}
