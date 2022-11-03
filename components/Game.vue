<script setup lang="ts">
import { getWordOfTheDay } from '~/words'
import { LetterState } from '~/types'

// get all words from db
const res = await useAsyncData('words', async () => {
  const { data } = await useFetch('/api/all-words')

  return data.value
})

// Get word of the day
const answer = getWordOfTheDay(res.data.value)

// Board state. Each tile is represented as { letter, state }
const board = ref(
  Array.from({ length: 6 }, () =>
    Array.from({ length: 5 }, () => ({
      letter: '',
      state: LetterState.INITIAL
    }))
  )
)

// Current active row.
const currentRowIndex = ref(0)
const currentRow = computed(() => board.value[currentRowIndex.value])

// Feedback state: message and shake
const message = ref('')
const grid = ref('')
const shakeRowIndex = ref(-1)
const success = ref(false)

// Keep track of revealed letters for the virtual keyboard
// @ts-ignore
const letterStates: Record<string, LetterState> = ref({})

// Handle keyboard input.
let allowInput = true

const onKeyup = (e: KeyboardEvent) => onKey(e.key)

onMounted(() => {
  window.addEventListener('keyup', onKeyup)
})
onUnmounted(() => {
  window.removeEventListener('keyup', onKeyup)
})

function onKey(key: string) {
  if (!allowInput) return

  switch (key) {
    case 'Backspace':
      clearTile()
      break;
    case 'Enter':
      completeRow()
      break;

    default: {
      if (/^[a-zA-ZÁÓÍŃÚǴáóıńúǵ]$/.test(key)) {
        fillTile(key.toLowerCase())
      }
      break;
    }
  }
}

function fillTile(letter: string) {
  for (const tile of currentRow.value) {
    if (!tile.letter) {
      tile.letter = letter
      break
    }
  }
}

function clearTile() {
  for (const tile of [...currentRow.value].reverse()) {
    if (tile.letter) {
      tile.letter = ''
      break
    }
  }
}


function completeRow() {
  const guess = currentRow.value.map((tile) => tile.letter).join('')

  useFetch('/api/word', {
    method: 'POST',
    body: { word: guess },
    initialCache: false,
  })
  
  if (currentRow.value.every((tile) => tile.letter)) {

    // if (!allWords.includes(guess) && guess !== answer) {
    //   shake()
    //   showMessage(`Not in word list`)
    //   return
    // }

    const answerLetters: (string | null)[] = answer.split('')

    // first pass: mark correct ones
    currentRow.value.forEach((tile, i) => {
      if (answerLetters[i] === tile.letter) {
        tile.state = letterStates.value[tile.letter] = LetterState.CORRECT
        answerLetters[i] = null
      }
    })

    // second pass: mark the present
    currentRow.value.forEach((tile) => {
      if (!tile.state && answerLetters.includes(tile.letter)) {
        tile.state = LetterState.PRESENT
        answerLetters[answerLetters.indexOf(tile.letter)] = null
        if (!letterStates.value[tile.letter]) {
          letterStates.value[tile.letter] = LetterState.PRESENT
        }
      }
    })

    // 3rd pass: mark absent
    currentRow.value.forEach((tile) => {
      if (!tile.state) {
        tile.state = LetterState.ABSENT
        if (!letterStates.value[tile.letter]) {
          letterStates.value[tile.letter] = LetterState.ABSENT
        }
      }
    })

    allowInput = false

    if (currentRow.value.every((tile) => tile.state === LetterState.CORRECT)) {
      // yay!
      setTimeout(() => {
        grid.value = genResultGrid()
        showMessage(
          ['Bárekella', 'Ájayıp', 'Tań qalarlıq', 'Zor', 'Jaqsı', 'Keyingi saparı'][
          currentRowIndex.value
          ],
          -1
        )
        success.value = true
      }, 1600)
    } else if (currentRowIndex.value < board.value.length - 1) {
      // go the next row
      currentRowIndex.value++
      setTimeout(() => {
        allowInput = true
      }, 1600)
    } else {
      // game over :(
      setTimeout(() => {
        showMessage(answer.toUpperCase(), -1)
      }, 1600)
    }
  } else {
    shake()
    showMessage('Háripler jeterli emes')
  }
}

function showMessage(msg: string, time = 1000) {
  message.value = msg
  if (time > 0) {
    setTimeout(() => {
      message.value = ''
    }, time)
  }
}

function shake() {
  shakeRowIndex.value = currentRowIndex.value
  setTimeout(() => {
    shakeRowIndex.value = -1
  }, 1000)
}

const icons = {
  [LetterState.CORRECT]: '🟩',
  [LetterState.PRESENT]: '🟨',
  [LetterState.ABSENT]: '⬜',
  [LetterState.INITIAL]: null
}

function genResultGrid() {
  return board.value
    .slice(0, currentRowIndex.value + 1)
    .map((row) => {
      return row.map((tile) => icons[tile.state]).join('')
    })
    .join('\n')
}
</script>

<template>
  <Transition>
    <div :class="$style.message" v-if="message">
      {{ message }}
      <pre v-if="grid">{{ grid }}</pre>
    </div>
  </Transition>
  <div :class="$style.board">
    <div v-for="(row, index) in board" :class="[
      $style.row,
      shakeRowIndex === index && $style.shake,
      success && currentRowIndex === index && $style.jump
    ]">
      <div v-for="(tile, index) in row"
        :class="[$style.tile, tile.letter && $style.filled, tile.state && $style.revealed]">
        <div :class="$style.front" :style="{ transitionDelay: `${index * 300}ms` }">
          {{ tile.letter }}
        </div>
        <div :class="[$style.back, tile.state]" :style="{
          transitionDelay: `${index * 300}ms`,
          animationDelay: `${index * 100}ms`
        }">
          {{ tile.letter }}
        </div>
      </div>
    </div>
  </div>
  <Keyboard @key="onKey" :letter-states="letterStates" />
</template>

<style module>
.board {
  display: grid;
  grid-template-rows: repeat(6, 1fr);
  grid-gap: 5px;
  padding: 10px;
  box-sizing: border-box;
  --height: min(420px, calc(var(--vh, 100vh) - 310px));
  height: var(--height);
  width: min(350px, calc(var(--height) / 6 * 5));
  margin: 0px auto;
}

.message {
  position: absolute;
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

.message.v-leave-to {
  opacity: 0;
}

.row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 5px;
}

.tile {
  width: 100%;
  font-size: 2rem;
  line-height: 2rem;
  font-weight: bold;
  vertical-align: middle;
  text-transform: uppercase;
  user-select: none;
  position: relative;
}

.tile.filled {
  animation: zoom 0.2s;
}

.tile .front,
.tile .back {
  box-sizing: border-box;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.tile .front {
  border: 2px solid #d3d6da;
}

.tile.filled .front {
  border-color: #999;
}

.tile .back {
  transform: rotateX(180deg);
}

.tile.revealed .front {
  transform: rotateX(180deg);
}

.tile.revealed .back {
  transform: rotateX(0deg);
}

@keyframes zoom {
  0% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}

.shake {
  animation: shake 0.5s;
}

@keyframes shake {
  0% {
    transform: translate(1px);
  }

  10% {
    transform: translate(-2px);
  }

  20% {
    transform: translate(2px);
  }

  30% {
    transform: translate(-2px);
  }

  40% {
    transform: translate(2px);
  }

  50% {
    transform: translate(-2px);
  }

  60% {
    transform: translate(2px);
  }

  70% {
    transform: translate(-2px);
  }

  80% {
    transform: translate(2px);
  }

  90% {
    transform: translate(-2px);
  }

  100% {
    transform: translate(1px);
  }
}

.jump .tile .back {
  animation: jump 0.5s;
}

@keyframes jump {
  0% {
    transform: translateY(0px);
  }

  20% {
    transform: translateY(5px);
  }

  60% {
    transform: translateY(-25px);
  }

  90% {
    transform: translateY(3px);
  }

  100% {
    transform: translateY(0px);
  }
}

@media (max-height: 680px) {
  .tile {
    font-size: 3vh;
  }
}
</style>
