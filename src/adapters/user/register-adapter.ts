import { CreateUser } from '@/core/types/user'
import { register as registerCore, Register, OutsideRegister } from '@/core/use-cases/user/register'

export type OutsideRegisterType = OutsideRegister<{
  sucess: boolean,
  data: CreateUser,
}>

export const register: Register = (outsideRegister) => (data) =>
  registerCore(outsideRegister)(data)
