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
</script>

<template>
  <div :class="$style.keyboard">
    <div :class="$style.row" v-for="(row, i) in rows">
      <div :class="$style.spacer" v-if="i === 1" />
      <button v-for="key in row" :class="[letterStates[key], key.length > 1 && $style.big]"
        @click="$emit('key', key)">
        <span v-if="key !== 'Backspace'">{{ key }}</span>
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
