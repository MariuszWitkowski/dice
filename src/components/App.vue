<template>
  <div id="content-container">
    <div id="game-container" ref="gameContainer"></div>
  </div>
  <Controls @toggle-options="toggleOptions" @roll-dice="onRollDice" />
  <OptionsModal
    v-if="showOptions"
    @close="toggleOptions"
    :numDice="numDice"
    :numEdges="numEdges"
    @update-options="updateOptions"
  />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { init, rollDice } from '../dice';
import Controls from './Controls.vue';
import OptionsModal from './OptionsModal.vue';

const gameContainer = ref(null);
const showOptions = ref(false);
const numDice = ref(1);
const numEdges = ref(6);

onMounted(() => {
  if (gameContainer.value) {
    init(gameContainer.value);
  }
});

const toggleOptions = () => {
  showOptions.value = !showOptions.value;
};

const updateOptions = (options) => {
  numDice.value = options.numDice;
  numEdges.value = options.numEdges;
};

const onRollDice = () => {
  rollDice(numDice.value, numEdges.value);
};
</script>

<style scoped>
</style>
