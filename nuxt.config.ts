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
  modules: ['@sidebase/nuxt-auth', '@nuxt/ui'],
  // AUTH
  auth: {
    session: {
      enableRefreshOnWindowFocus: true, // o false, a seconda delle tue esigenze
    },
    origin: 'http://localhost:3000',
  },
  ssr: true,
})