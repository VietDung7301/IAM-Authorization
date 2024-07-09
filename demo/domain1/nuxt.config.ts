// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],
  runtimeConfig: {
    public: {
      AUTHORIZATION_ENDPOINT: process.env.AUTHORIZATION_ENDPOINT,
      TOKEN_ENDPOINT: process.env.TOKEN_ENDPOINT,
      OAUTH_RESPONSE_TYPE: 'code',
      REDIRECT_URI: process.env.LOGIN_CALLBACK,
      CLIENT_ID: process.env.CLIENT_ID,
      CLIENT_SECRET: process.env.CLIENT_SECRET,
      AUTH_SCOPES: process.env.AUTH_SCOPES,
      RESOURCE_ENDPOINT: process.env.RESOURCE_ENDPOINT,
      SAVE_TOKEN_ENDPOINT: process.env.SAVE_TOKEN_ENDPOINT,
      GET_TOKEN_ENDPOINT: process.env.GET_TOKEN_ENDPOINT,
      LOGOUT_ENDPOINT: process.env.LOGOUT_ENDPOINT,
      EX_RESOURCE_1: process.env.EX_RESOURCE_1,
      EX_RESOURCE_2: process.env.EX_RESOURCE_2
    }
  },
  devServer: {
    port: parseInt(process.env.PORT || '3001')
  }
})
