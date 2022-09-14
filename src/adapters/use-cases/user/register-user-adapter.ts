import * as user from '@/core/use-cases/user/register-user'
import { User, CreateUser } from '@/core/types/user'

export type OutsideRegisterUser = user.OutsideRegisterUser<{
  user: User,
}>
export { User, CreateUser }
// export type OutsideRegisterUser = (data: User) => Promise<{
//   user: User,
// }>

export const registerUser: user.RegisterUser = (outsideRegister) => (data) =>
  user.registerUser(outsideRegister)(data)
