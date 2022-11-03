<script setup lang="ts">
const { trackPageview } = usePlausible()

onMounted(() => {
  // resize for scaling the board size
  window.addEventListener('resize', onResize)
  // set size on startup
  onResize()

  trackPageview()
})

function onResize() {
  // get actual vh on mobile
  document.body.style.setProperty('--vh', window.innerHeight + 'px')
}
</script>

<template>
  <Header />
  <Game />
</template>
