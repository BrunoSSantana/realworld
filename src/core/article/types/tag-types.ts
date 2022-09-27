import * as t from 'io-ts'
import { slugCodec } from '@/core/_types'

export const tagCodec = slugCodec

export type Tag = t.TypeOf<typeof tagCodec>
