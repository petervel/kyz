<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import FingerCircle, { type Finger } from "../components/FingerCircle.vue"
import { createHsl, getHue, releaseHue } from '../components/hue'

const TESTING = true

const fingers = ref<Finger[]>([])
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
    }, 30000)
  }
}

if (TESTING) {
  fingers.value.push({
    x: 120,
    y: 120,
    hue: getHue(),
    identifier: 1337
  })
  fingers.value.push({
    x: 220,
    y: 220,
    hue: getHue(),
    identifier: 1336
  })
  resetTimer()
}


const startTouch = (evt: TouchEvent) => {
  if (winnerIdentifier.value != undefined) return
  for (const touch of evt.changedTouches) {
    const newFinger: Finger = {
      x: touch.clientX,
      y: touch.clientY,
      hue: getHue(),
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
        releaseHue(finger.hue)
        return false;
      } else {
        return true
      }
    })
    if (!winnerIdentifier.value || touch.identifier == winnerIdentifier.value) {
      winnerIdentifier.value = undefined
      resetTimer()
    }
  }
}

onMounted(() => {
  window.addEventListener('touchstart', startTouch);
  window.addEventListener('touchmove', trackTouch, { passive: false });
  window.addEventListener('touchend', endTouch);
  window.addEventListener('touchcancel', endTouch);
  window.addEventListener('contextmenu', preventContextMenu);

});

onUnmounted(() => {
  window.removeEventListener('touchstart', startTouch);
  window.removeEventListener('touchmove', trackTouch);
  window.removeEventListener('touchend', endTouch);
  window.removeEventListener('touchcancel', endTouch);
  window.removeEventListener('contextmenu', preventContextMenu);
});

function preventContextMenu(e: Event) {
  e.preventDefault();
}
</script>

<template>
  <main :style="{ backgroundColor: winner ? createHsl(winner.hue) : 'unset' }">
    <FingerCircle v-for="finger in fingers" :x="finger.x" :y="finger.y" :hue="finger.hue"
      :identifier="finger.identifier" :winner="winnerIdentifier" v-bind:key="finger.identifier" />
  </main>
</template>

<style lang="css" scoped>
main {
  flex: 1;
  transition: background-color 300ms 300ms ease;
}
</style>
