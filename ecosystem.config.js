module.exports = {
  apps: [
    {
      name: 'Wordle',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs'
    }
  ]
}
