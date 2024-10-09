import dotenv from 'dotenv'
dotenv.config()

import GithubProvider from 'next-auth/providers/github'
import DiscordProvider from "next-auth/providers/discord";
import { NuxtAuthHandler } from '#auth'

export default NuxtAuthHandler({
    pages: {
        // behavior login page
        signIn: '/login'
    },
    // A secret string you define, to ensure correct encryption
    secret: process.env.AUTH_SECRET,
    // Login and callback URLs
    providers: [
        // @ts-expect-error Use .default here for it to work during SSR.
        GithubProvider.default({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET
        }),
        // TODO discord https
        // DiscordProvider.default({
        //     clientId: process.env.DISCORD_CLIENT_ID,
        //     clientSecret: process.env.DISCORD_CLIENT_SECRET
        // })
    ]
})