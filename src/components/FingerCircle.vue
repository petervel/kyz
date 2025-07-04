<script setup lang="ts">

const { x, y, colour } = defineProps(["x", "y", "colour"])
</script>

<template>
  <div :style="{ left: `${x}px`, top: `${y}px`, borderColor: colour }" class="circle"></div>
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
  /* transition: left 10ms linear, top 10ms linear; */
}
</style>
