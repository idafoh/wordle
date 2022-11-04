<script setup lang="ts">
onMounted(() => {
  // resize for scaling the board size
  window.addEventListener('resize', onResize)
  // set size on startup
  onResize()
})

function onResize() {
  // get actual vh on mobile
  document.body.style.setProperty('--vh', window.innerHeight + 'px')
}
</script>

<template>
  <Header />
  <Game />
  <footer>
    Jaratıwshı: <a href="https://abat.me/?utm_campaign=developer&utm_source=wordle" rel="noopener noreferrer" target="_blank">Abat Dauletbaev</a>
  </footer>
</template>
