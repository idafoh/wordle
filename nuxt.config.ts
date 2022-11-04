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
        { property: 'og:title', content: 'Sózle' },
        { property: 'og:url', content: 'https://sozle.qaraqalpaq.org' },
        { property: 'og:image', content: 'https://sozle.qaraqalpaq.org/og.svg' },
        { property: 'og:image:width', content: '800' },
        { property: 'og:image:height', content: '400' },
        { name: 'description', content: 'Qaraqalpaqsha wordle (sóz oyını).' },
      ],
    },
  },
  plausible: {
    domain: 'sozle.qaraqalpaq.org',
  },
})
