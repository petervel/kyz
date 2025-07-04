<script setup lang="ts">
import { ref } from 'vue'


interface Finger {
  x: number,
  y: number,
  colour: string,
  identifier: number
}

const fingers = ref<Finger[]>([])

const startTouch = (evt: TouchEvent) => {
  const touch = evt.touches[0] // first finger
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
  console.log({ evt })
}
window.addEventListener('touchstart', startTouch)
window.addEventListener('touchmove', trackTouch)
window.addEventListener('touchend', endTouch)
</script>

<template>
  {{ fingers }}
</template>
