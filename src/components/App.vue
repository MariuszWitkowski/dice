<template>
  <div id="content-container">
    <div id="game-container" ref="gameContainer"></div>
  </div>
  <Controls />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { init } from '../dice';
import Controls from './Controls.vue';

const gameContainer = ref(null);

onMounted(() => {
  if (gameContainer.value) {
    init(gameContainer.value);
  }
});
</script>

<style scoped>
</style>
