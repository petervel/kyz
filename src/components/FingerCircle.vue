<script setup lang="ts">

const { x, y, identifier } = defineProps(["x", "y", "identifier"])

console.log({ x, y, identifier })
</script>

<template>
  <div :style="{ left: `${x - 20}px`, top: `${y - 20}px` }" class="circle"></div>
</template>

<style lang="css" scoped>
.circle {
  position: absolute;
  border: 3px solid green;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
</style>
