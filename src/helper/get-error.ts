export const getError = (erros: string) => {
  return {
    errors: {
      body: erros.split(':::'),
    },
  }
}
