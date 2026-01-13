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
    <label for="dice-edges-selector">Edges:</label>
    <select id="dice-edges-selector" v-model="numEdges">
      <option value="3">d3</option>
      <option value="4">d4</option>
      <option value="6">d6</option>
      <option value="8">d8</option>
      <option value="10">d10</option>
      <option value="12">d12</option>
      <option value="20">d20</option>
    </select>
    <input type="checkbox" id="3d-checkbox" style="margin: 0 10px;" v-model="is3D" @change="onToggle3D" :disabled="numEdges !== '6'">
    <label for="3d-checkbox">3D</label>
    <button id="roll-button" @click="onRollDice">Roll</button>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { init, rollDice, toggle3D, setNumEdges } from '../dice';

const numDice = ref(1);
const numEdges = ref('6');
const is3D = ref(true);
const gameContainer = ref(null);

onMounted(() => {
  if (gameContainer.value) {
    init(gameContainer.value);
  }
});

watch(numEdges, (newEdges) => {
  setNumEdges(parseInt(newEdges, 10));
  if (newEdges !== '6') {
    is3D.value = false;
    onToggle3D();
  }
});

const onRollDice = () => {
  rollDice(parseInt(numDice.value, 10), parseInt(numEdges.value, 10));
};

const onToggle3D = () => {
  toggle3D(is3D.value);
};
</script>

<style scoped>
</style>
