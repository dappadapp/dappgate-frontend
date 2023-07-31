import type { NextAuthOptions } from 'next-auth'
import TwitterProvider from 'next-auth/providers/twitter'
import CredentialsProvider from 'next-auth/providers/credentials'

export const options: NextAuthOptions = {
    providers: [

        TwitterProvider({
            clientId: "Sl8yakRUS05XQVdTMEVnekVvaWs6MTpjaQ",
            clientSecret: "H2HA32k3TIKWZaWi2KrrEUWf3LI9ANP7tGGcfAbuA978P7Z4H5" ,
            version: "2.0", // opt-in to Twitter OAuth 2.0
        }),

    ],
}
