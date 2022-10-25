type GetError = {
  errors: string
  context?: string
}

export const getError = ({ errors, context = 'no-context' } : GetError) => {
  return {
    [context]: {
      errors: {
        body: errors.split(':::'),
      },
    },
  }
}
