import { OutsideRegisterType } from '@/adapters/use-cases/user/register-adapter'

// outside faker
export const outsideRegister: OutsideRegisterType = async (data) => {
  return {
    user: {
      email: data.email,
      username: data.username,
      bio: undefined,
      token: undefined,
      image: undefined,
    },
  }
}
