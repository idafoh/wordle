<script setup lang="ts">
import { LetterState } from '~/types'

defineProps<{
  letterStates: Record<string, LetterState>
}>()

defineEmits<{
  (e: 'key', key: string): void
}>()

const rows = [
  ['á', 'ó', 'ı', 'ń', 'ú', 'ǵ'],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['Enter', ...['z', 'x', 'c', 'v', 'b', 'n', 'm'], 'Backspace']
]

const specials = [rows[3][0], rows[3][8]]
</script>

<template>
  <div :class="$style.keyboard">
    <div v-for="(row, i) in rows" :class="[$style.row, i === 0 && $style.kaa]">
      <div :class="$style.spacer" v-if="i === 1" />
      <button v-for="key in row"
        :class="[letterStates[key] || 'regular', specials.includes(key) && 'special', key.length > 1 && $style.big]"
        @click="$emit('key', key)">
        <span v-if="key !== 'Backspace'">{{ key === 'ı' ? 'Í' : key }}</span>
        <backspace-icon v-else />
      </button>
      <div :class="$style.spacer" v-if="i === 1" />
    </div>
  </div>
</template>

<style module>
.keyboard {
  margin: 30px 8px 0;
  user-select: none;
}

.row {
  display: flex;
  width: 100%;
  margin: 0 auto 8px;
  touch-action: manipulation;
}

.row.kaa {
  width: 75%;
}

.spacer {
  flex: 0.5;
}

button {
  font-family: inherit;
  font-weight: bold;
  border: 0;
  padding: 0;
  margin: 0 6px 0 0;
  height: 58px;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
  background-color: #d3d6da;
  color: #1a1a1b;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0.3);
  transition: all 0.2s 1.5s;
}

button:last-of-type {
  margin: 0;
}

button.big {
  flex: 1.5;
}
</style>
