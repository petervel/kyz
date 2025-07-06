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
  finger: Finger,
  winner?: number
}

const { finger, winner } = defineProps<FingerProps>()

const status = computed(() => {
  if (winner == undefined) return "playing";
  return (winner == finger.identifier) ? "won" : "lost";
})

const animating = ref(false);

watch(status, (newStatus) => {
  if (newStatus === "won") {
    animating.value = false;
    setTimeout(() => {
      animating.value = true;
    }, 300); // --animation-time
  }
});
</script>

<template>
  <div class="container" :class="status" :style="{ left: `${finger.x}px`, top: `${finger.y}px` }">
    <div class="circle" :style="{ borderColor: createHsl(finger.hue) }">
      <div class="inner" :style="{ backgroundColor: createHsl(finger.hue) }"></div>
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
  --animation-time: 300ms;
}



.circle {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity var(--animation-time) ease, transform var(--animation-time) ease;
  position: relative;
  transition: border-color var(--animation-time) var(--animation-time) ease;
  border-width: 10px;
  animation: pulse 1s infinite, rotate 3s linear infinite;
  border-style: dashed;
  border-radius: 50%;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg)
  }

  50% {
    transform: rotate(180deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.lost .circle {
  opacity: 0;
  transform: scale(0.5);
}

.won .circle {
  border-color: var(--color-background) !important;
}

.circle-animation {
  border-width: 11px;
  border-color: var(--color-background);
  border-style: solid;
  border-radius: 50%;

  width: 100%;
  height: 100%;
  opacity: 0;
  pointer-events: none;
  color: var(--color-background);
  position: absolute;
  will-change: transform, opacity;
  transform: scale(3);
  transition: transform var(--animation-time) ease-out, opacity var(--animation-time) ease;
}

.circle-animation.animating {
  opacity: 1;
  transform: scale(1.7);
}

.won .circle .inner {
  background-color: var(--color-background) !important;
}

.circle .inner {
  transition: background-color var(--animation-time) var(--animation-time) ease;
  border-radius: 50%;
  width: 80%;
  height: 80%;
  position: absolute;
}
</style>
