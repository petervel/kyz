<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <!-- <header>
    Kyz
  </header> -->

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  font-size: 2rem;
  max-height: 100vh;
  background: #e9c46a;
  color: #333;
  padding-inline: 1rem;
  box-shadow: 1px 3px 10px 0px rgba(0, 0, 0, 0.3);
}
</style>
