import type { NextAuthOptions } from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import axios from "axios";
import NextAuth, { Awaitable, Session, User } from "next-auth";
type ExtendedUserType = User & {
  username?: string;
  uid?: string;
  profile?: object;
};

export const options: NextAuthOptions = {
  providers: [
    TwitterProvider({
      clientId: "a0QxT0FWNzItYU50RWI2Y19pYV86MTpjaQ",
      clientSecret: "NdzOyAROzRUISFyXjgy51528dIzK0Dfcycer8eqOMRQLjB3XoL",
      version: "2.0",
    }),
  ],

  callbacks: {
    async jwt({ token, account, profile }) {
      if (profile) {
        token.username = profile;
      }
      return token;
    },
    async session({ session, token, user }): Promise<Session> {
      (session.user as ExtendedUserType).uid = token.sub;
      (session.user as ExtendedUserType).profile = token.username as object;

      return session;
    },
  },
};
