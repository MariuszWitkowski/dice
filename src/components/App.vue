<template>
  <div id="content-container">
    <div id="game-container" ref="gameContainer"></div>
  </div>
  <div id="controls-container">
    <label for="dice-selector">Number of dice:</label>
    <select id="dice-selector" v-model="numDice">
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
      <option value="6">6</option>
    </select>
    <input type="checkbox" id="3d-checkbox" style="margin: 0 10px;" v-model="is3D" @change="onToggle3D">
    <label for="3d-checkbox">3D</label>
    <button id="roll-button" @click="onRollDice">Roll</button>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { init, rollDice, toggle3D } from '../dice';

const numDice = ref(1);
const is3D = ref(true);
const gameContainer = ref(null);

onMounted(() => {
  if (gameContainer.value) {
    init(gameContainer.value);
  }
});

const onRollDice = () => {
  rollDice(numDice.value);
};

const onToggle3D = () => {
  toggle3D(is3D.value);
};
</script>

<style scoped>
</style>
