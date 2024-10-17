// import dotenv from 'dotenv'
// dotenv.config()

// import GithubProvider from 'next-auth/providers/github'
// import DiscordProvider from "next-auth/providers/discord";
// import { NuxtAuthHandler } from '#auth'

// export default NuxtAuthHandler({
//     pages: {
//         // behavior login page
//         signIn: '/login'
//     },
//     // A secret string you define, to ensure correct encryption
//     secret: process.env.AUTH_SECRET,
//     // Login and callback URLs
//     providers: [
//         // @ts-expect-error Use .default here for it to work during SSR.
//         GithubProvider.default({
//             clientId: process.env.GITHUB_CLIENT_ID,
//             clientSecret: process.env.GITHUB_CLIENT_SECRET
//         }),
//         // TODO discord https
//         // DiscordProvider.default({
//         //     clientId: process.env.DISCORD_CLIENT_ID,
//         //     clientSecret: process.env.DISCORD_CLIENT_SECRET
//         // })
//     ]
// })
type User = {
    id: number;
    credits: number;
    email?: string;
    name?: string;
    password?: string;
}

interface Session {
    user: User;
}

type AdapterUser = {
    id: number;
    credits: number;
    email?: string;
    name?: string;
    password?: string;
}

interface Token {
    sub?: string;
}

// Definisci un'interfaccia personalizzata per l'utente della sessione
interface CustomSessionUser {
    id: string;
    email: string | null;
    credits: number;
    name?: string | null;
    image?: string | null;
}

// Estendi il tipo di sessione per includere l'utente personalizzato
declare module 'next-auth' {
    interface Session {
        user: CustomSessionUser;
    }
}

// server/auth.config.ts
import { NuxtAuthHandler } from '#auth';
import GithubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt';
import prisma from '~/lib/prisma';


export default NuxtAuthHandler({
    adapter: PrismaAdapter(prisma),
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 giorni
        updateAge: 24 * 60 * 60,    // 24 ore
    },
    secret: process.env.AUTH_SECRET,
    providers: [
        // Provider OAuth con Google
        GithubProvider.default({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET
        }),
        // Provider di credenziali personalizzato
        CredentialsProvider.default({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials: { email: string; password: string }) {
                if (!credentials?.email || !credentials.password) {
                    throw new Error('Email e password sono richieste');
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user) {
                    throw new Error('Credenziali non valide');
                }

                const isValid = await bcrypt.compare(credentials.password, user.password as string);

                if (!isValid) {
                    throw new Error('Credenziali non valide');
                }

                return { id: user.id, email: user.email, credits: user.credits as number };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            //Aggiungi le informazioni dell'utente al token
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.credits = user.credits as number ?? 0;
            }
            return token
        },
        async session({ session, token }) {
            // Aggiungi le informazioni dal token alla sessione
            if (token) {
                session.user.id = token.id as string;
                session.user.name = token.name as string ?? null;
                session.user.credits = token.credits as number;// Aggiungi il campo credits
                session.user.email = token.email as string ?? null;
            }
            return session
        }
    }
});