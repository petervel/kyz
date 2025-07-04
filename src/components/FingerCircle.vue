<script setup lang="ts">
import { computed } from 'vue';


const { x, y, colour, identifier, winner } = defineProps(["x", "y", "colour", "identifier", "winner"])

const status = computed(() => {
  if (winner == undefined) return "playing";
  return (winner == identifier) ? "won" : "lost"
})
</script>

<template>
  <div class="container" :class="status" :style="{ left: `${x}px`, top: `${y}px` }">
    <div class="circle" :style="{ borderColor: colour }">
      <div class="inner" :style="{ backgroundColor: colour }"></div>
      <div class="circle-animation" v-if="status == 'won'"></div>
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
  border-width: 10px;
  border-color: black;
  width: 100%;
  height: 100%;
  opacity: 1;
  color: black;
  position: absolute;
  transform: scale(2);
  transition: transform var(--animation-time) ease-out, opacity var(--animation-time) ease;
}

.won .circle-animation {
  opacity: 0;
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
