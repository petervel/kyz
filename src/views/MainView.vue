<script setup lang="ts">
import { computed, ref } from 'vue'
import FingerCircle from "../components/FingerCircle.vue"
import { getHue, releaseHue, type ColourCode } from '../components/hue'

interface Finger {
  x: number,
  y: number,
  colourCode: ColourCode,
  identifier: number
}

const fingers = ref<Finger[]>([])

const TESTING = false
if (TESTING) {
  fingers.value.push({
    x: 120,
    y: 120,
    colourCode: getHue(),
    identifier: 1337
  })
}


const winnerIdentifier = ref<number | undefined>()
const winner = computed(() => {
  if (winnerIdentifier.value == undefined) return undefined;
  return fingers.value.find(f => f.identifier == winnerIdentifier.value)
})

let timeout: ReturnType<typeof setTimeout> | null = null

const resetTimer = () => {
  if (timeout) clearTimeout(timeout)

  if (fingers.value.length >= 2) {
    winnerIdentifier.value = undefined
    timeout = setTimeout(() => {
      const winnerIndex = Math.floor(Math.random() * fingers.value.length)
      winnerIdentifier.value = fingers.value[winnerIndex].identifier
    }, 3000)
  }
}

const startTouch = (evt: TouchEvent) => {
  for (const touch of evt.changedTouches) {
    const newFinger: Finger = {
      x: touch.clientX,
      y: touch.clientY,
      colourCode: getHue(),
      identifier: touch.identifier
    }
    fingers.value.push(newFinger)
  }
  resetTimer()
}

const trackTouch = (evt: TouchEvent) => {
  evt.preventDefault();
  for (const touch of evt.changedTouches) {
    fingers.value = fingers.value.map(finger => {
      if (finger.identifier != touch.identifier) return finger;
      return { ...finger, x: touch.pageX, y: touch.pageY }
    })
  }
}

const endTouch = (evt: TouchEvent) => {
  for (const touch of evt.changedTouches) {
    fingers.value = fingers.value.filter(finger => {
      if (finger.identifier == touch.identifier) {
        releaseHue(finger.colourCode.hue)
        return false;
      } else {
        return true
      }
    })
  }
  resetTimer()
}

window.addEventListener('touchstart', startTouch, { passive: false })
window.addEventListener('touchmove', trackTouch, { passive: false })
window.addEventListener('touchend', endTouch, { passive: false })
</script>

<template>
  <main :style="{ backgroundColor: winner ? winner.colourCode.colour : 'unset' }">
    <FingerCircle v-for="finger in fingers" :x="finger.x" :y="finger.y" :colour="finger.colourCode.colour"
      :identifier="finger.identifier" :winner="winnerIdentifier" v-bind:key="finger.identifier" />
  </main>
</template>

<style lang="css" scoped>
main {
  flex: 1;
  transition: background-color 300ms ease;
}
</style>
