<script setup lang="ts">
const isOpen = ref(false)
const word = ref('')

const closeModal = (e?: KeyboardEvent) => {
  if (e && e.code === 'Escape') {
    isOpen.value = false
    e.preventDefault()
    return
  }

  if (!e) {
    isOpen.value = false
  }
}

const createUri = () => {
  if (word.value.length !== 5) {
    alert('Bes háripli sóz kiritiń')
    return
  }

  const encodedWord = btoa(word.value)
  const url = `http://localhost:3000/?w=${encodeURIComponent(encodedWord)}`

  useFetch('/api/word', {
    method: 'POST',
    body: { word }
  })

  navigator.clipboard.writeText(url)
  closeModal()
  alert('Nusqalap alındı')
}

onMounted(() => {
  window.addEventListener('keydown', closeModal)
})
onUnmounted(() => {
  window.removeEventListener('keydown', closeModal)
})
</script>


<template>
  <pop-up>
    <div v-if="isOpen" :class="$style.modal">
      <p>Sózdi kiritiń</p>
      <input v-model="word" type="text" placeholder="Mısalı: sálem" maxlength="5" minlength="5" />
      <button @click="createUri">Úlesiw</button>
    </div>
  </pop-up>
  <header>
    <span @click="isOpen = !isOpen" :class="$style.custom">Ózim sóz qosıp<br /> oynaymaqshıman</span>
    <h1>SÓZLE</h1>
  </header>
</template>

<style module>
.custom {
  cursor: pointer;
}

.modal {
  position: absolute;
  min-width: 30vw;
  left: 50%;
  top: 80px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.85);
  padding: 16px 20px;
  z-index: 2;
  border-radius: 4px;
  transform: translateX(-50%);
  transition: opacity 0.3s ease-out;
  font-weight: 600;
}

.modal button {
  width: 30%;
  padding: 10px;
  height: auto !important;
  margin: 5px auto !important;
  margin-top: 15px !important;
}
</style>
