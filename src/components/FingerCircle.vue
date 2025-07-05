<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { createHsl } from './hue';

export interface Finger {
  x: number,
  y: number,
  hue: number,
  identifier: number
}

type FingerProps = {
  x: number,
  y: number,
  hue: number,
  identifier: number,
  winner?: number
}

const { x, y, hue, identifier, winner } = defineProps<FingerProps>()

const status = computed(() => {
  if (winner == undefined) return "playing";
  return (winner == identifier) ? "won" : "lost";
})

const animating = ref(false);

watch(status, (newStatus) => {
  if (newStatus === "won") {
    animating.value = true;
    setTimeout(() => {
      animating.value = false;
    }, 300); // match --animation-time
  }
});
</script>

<template>
  <div class="container" :class="status" :style="{ left: `${x}px`, top: `${y}px` }">
    <div class="circle" :style="{ borderColor: createHsl(hue) }">
      <div class="inner" :style="{ backgroundColor: createHsl(hue) }"></div>
      <div class="circle-animation" :class="{ animating }"></div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.container {
  position: absolute;
  width: 120px;
  height: 120px;
  transform: translate(-50%, -50%);
  display: flex;
  --animation-time: 300ms
}

.circle {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity var(--animation-time) ease, transform var(--animation-time) ease;
  transform-origin: center center;
  position: relative;
  border-width: 10px;
}

.circle,
.circle-animation {
  border-style: solid;
  border-radius: 50%;
}

.lost .circle {
  opacity: 0;
  transform: scale(0.5);
}

.won .circle {
  border-color: black !important;
}

.circle-animation {
  border-width: 5px;
  border-color: black;
  width: 100%;
  height: 100%;
  opacity: 1;
  pointer-events: none;
  color: black;
  position: absolute;
  will-change: transform, opacity;
  transform: scale(20);
  transition: transform var(--animation-time) ease-out, opacity var(--animation-time) ease;
}

.circle-animation.animating {
  opacity: 1;
  transform: scale(1);
}

.won .circle .inner {
  background-color: black !important;
}

.inner {
  border-radius: 50%;
  width: 80%;
  height: 80%;
  position: absolute;
}
</style>
