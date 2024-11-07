// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: ['@sidebase/nuxt-auth', '@nuxt/ui', '@pinia/nuxt', "@uploadthing/nuxt"],
  //Upload thing
  uploadthing: {
    /**
     * Path to your router definition file
     * @default `~/server/uploadthing.ts`
     */
    routerPath: "~/server/uploadthing.ts",
    token: process.env.UPLOADTHING_TOKEN,
  },
  // AUTH
  auth: {
    baseURL: 'http://localhost:3000/api/auth',
  },
  session: {
    enableRefreshOnWindowFocus: true, // o false, a seconda delle tue esigenze
  },
  origin: 'http://localhost:3000',
  ssr: true,
  // enableGloablAppMiddleware: true,
})