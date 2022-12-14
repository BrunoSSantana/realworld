import * as t from 'io-ts'
import { profileCodec } from '@/core/user/types/profile-types'
import { dateCodec, slugCodec } from '@/core/_types'
import { NonEmptyString, UUID, withMessage } from 'io-ts-types'

const commentCodecRequire = t.type({
  id: t.number,
  createdAt: dateCodec,
  updatedAt: dateCodec,
  body: t.string,
})
const commentCodecOptional = t.partial({
  author: profileCodec,
})
export const commentCodec = t.intersection([commentCodecRequire, commentCodecOptional])

export type Comment = t.TypeOf<typeof commentCodec>
export type CommentOutput = t.OutputOf<typeof commentCodec>

export const createCommentCodec = t.type({
  authorId: withMessage(UUID, () => 'authorId must be a valid UUID'),
  articleSlug: slugCodec,
  body: withMessage(
    NonEmptyString,
    () => 'O comentário não pode ser vazio',
  ),
})

export type CreateComment = t.TypeOf<typeof createCommentCodec>
