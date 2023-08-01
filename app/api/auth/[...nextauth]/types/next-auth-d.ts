import NextAuth from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      [x: string]: any
      /** The user's postal address. */
      address: string
      username: string
      accessToken: string
      id: string
      
    },
    profile: {
      data: {
        id: string
        name: string
        username: string
        location?: string
        description?: string
      }
  }
}

}