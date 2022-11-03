// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: [
    '@huntersofbook/plausible-nuxt'
  ],
  css: ['~/assets/styles/game.css'],
  app: {
    head: {
      title: 'Sózle',
      meta: [
        { name: 'description', content: 'Qaraqalpaqsha wordle (sóz oyını).' }
      ],
    },
  },
  plausible: {
    init: {
      domain: 'sozle.qaraqalpaq.org',
      trackLocalhost: false,
    },
  }
})
