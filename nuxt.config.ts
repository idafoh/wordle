// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: [
    'nuxt-plausible'
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
    domain: 'sozle.qaraqalpaq.org',
  }
})
