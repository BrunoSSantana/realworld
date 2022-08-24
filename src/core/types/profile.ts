import * as t from 'io-ts'

export const profileCodec = t.type({
  bio: t.string,
  image: t.string,
  following: t.boolean,
  username: t.string,
})

export type Profile = t.TypeOf<typeof profileCodec>
