export type UserSession = {
    user: {
      name: string | undefined,
      email: string | undefined,
      picture: string | undefined,
      sub: string | undefined,
      accessToken: string | undefined,
      iat: number | undefined,
      exp: number | undefined,
      jti: string | undefined
    },
    expires: string | undefined
  }
