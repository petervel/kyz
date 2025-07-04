<script setup lang="ts">
import { computed } from 'vue';


const { x, y, colour, identifier, winner } = defineProps(["x", "y", "colour", "identifier", "winner"])

const status = computed(() => {
  if (winner == undefined) return "playing";
  return (winner == identifier) ? "won" : "lost"
})
</script>

<template>
  <div class="container" :style="{ left: `${x}px`, top: `${y}px` }">
    <div :class="status" :style="{ borderColor: colour }" class="circle">
      <div class="inner" :style="{ backgroundColor: colour }"></div>
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
}

.circle {
  flex: 1;
  border-width: 12px;
  border-style: solid;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 300ms ease;
  transform-origin: center center;
}

.circle.lost {
  opacity: 0;
  transform: scale(0.5);
}

.circle.won {
  border-color: black !important;
}

.circle.won .inner {
  background-color: black !important;
}

.inner {
  border-radius: 50%;
  width: 80%;
  height: 80%;
}
</style>
