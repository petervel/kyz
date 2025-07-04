<script setup lang="ts">
import { ref } from 'vue'
import FingerCircle from "../components/FingerCircle.vue"

interface Finger {
  x: number,
  y: number,
  colour: string,
  identifier: number
}

const fingers = ref<Finger[]>([])

const startTouch = (evt: TouchEvent) => {
  const touch = evt.touches[0] // first finger
  console.log(touch)
  const newFinger: Finger = {
    x: touch.clientX,
    y: touch.clientY,
    colour: ["red", "yellow", "green"][Math.floor(Math.random() * 3)],
    identifier: touch.identifier
  }
  fingers.value.push(newFinger)
}

const endTouch = (evt: TouchEvent) => {
  console.log("UP", { evt })
  for (const touch of evt.changedTouches) {
    fingers.value = fingers.value.filter(finger => finger.identifier != touch.identifier)
  }
}

const trackTouch = (evt: TouchEvent) => {
  for (const touch of evt.changedTouches) {
    fingers.value = fingers.value.map(finger => {
      console.log({ finger, touch })
      if (finger.identifier != touch.identifier) return finger;
      return { ...finger, x: touch.pageX, y: touch.pageY }
    })
  }
}
window.addEventListener('touchstart', startTouch)
window.addEventListener('touchmove', trackTouch)
window.addEventListener('touchend', endTouch)
</script>

<template>
  <main>
    <FingerCircle v-for="finger in fingers" :x="finger.x" :y="finger.y" :identifier="finger.identifier"
      v-bind:key="finger.identifier" />
  </main>
</template>

<style lang="css" scoped>
main {
  flex: 1;
  border: 4px solid yellow;
  background: red;
}
</style>
