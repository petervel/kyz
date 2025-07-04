<script setup lang="ts">
import { computed } from 'vue';


const { x, y, colour, identifier, winner } = defineProps(["x", "y", "colour", "identifier", "winner"])

const won = computed(() => winner && winner == identifier)
</script>

<template>
  <div :class="{ won: won }" :style="{ left: `${x}px`, top: `${y}px`, borderColor: colour }" class="circle">
    <div class="inner" :style="{ backgroundColor: colour }"></div>
  </div>
</template>

<style lang="css" scoped>
.circle {
  position: absolute;
  border-width: 8px;
  border-style: solid;
  width: 120px;
  height: 120px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 300ms ease;
}

.circle.won {
  opacity: 0.1;
}

.inner {
  border-radius: 50%;
  width: 80%;
  height: 80%;
}
</style>
