import * as t from 'io-ts'
import { profileCodec } from '@/core/types/profile'
import { dateCodec } from './scalar'
import { NonEmptyString, withMessage } from 'io-ts-types'

export const commentCodec = t.type({
  id: t.number,
  createdAt: dateCodec,
  updatedAt: dateCodec,
  body: t.string,
  author: profileCodec,
})

export type Comment = t.TypeOf<typeof commentCodec>
export type OutputComment = t.OutputOf<typeof commentCodec>

export const createCommentCodec = t.type({
  body: withMessage(
    NonEmptyString,
    () => 'O comentário não pode ser vazio',
  ),
})

export type CreateComment = t.TypeOf<typeof createCommentCodec>
