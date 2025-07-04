<script setup lang="ts">
import { ref } from 'vue'
import FingerCircle from "../components/FingerCircle.vue"
import { getHue, releaseHue, type ColourCode } from '../components/hue'

interface Finger {
  x: number,
  y: number,
  colourCode: ColourCode,
  identifier: number
}

const fingers = ref<Finger[]>([])

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
}

window.addEventListener('touchstart', startTouch, { passive: false })
window.addEventListener('touchmove', trackTouch, { passive: false })
window.addEventListener('touchend', endTouch, { passive: false })
</script>

<template>
  <main>
    <FingerCircle v-for="finger in fingers" :x="finger.x" :y="finger.y" :colour="finger.colourCode.colour"
      v-bind:key="finger.identifier" />
  </main>
</template>

<style lang="css" scoped>
main {
  flex: 1;
  color: yellow;
}
</style>
