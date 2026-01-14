<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <h2>Options</h2>
      <div class="control-group">
        <label for="dice-selector">Number of dice:</label>
        <select id="dice-selector" :value="numDice" @change="onUpdate('numDice', $event.target.value)">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
        </select>
      </div>
      <div class="control-group">
        <label for="dice-edges-selector">Edges:</label>
        <select id="dice-edges-selector" :value="numEdges" @change="onUpdate('numEdges', $event.target.value)">
          <option value="3">d3</option>
          <option value="4">d4</option>
          <option value="6">d6</option>
          <option value="8">d8</option>
          <option value="10">d10</option>
          <option value="12">d12</option>
          <option value="20">d20</option>
        </select>
      </div>
      <div class="control-group">
        <input type="checkbox" id="3d-checkbox" v-model="is3D" @change="onToggle3D" :disabled="numEdges !== 6">
        <label for="3d-checkbox">3D</label>
      </div>
      <button @click="$emit('close')">Close</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { toggle3D, setNumEdges } from '../dice';

const props = defineProps({
  numDice: Number,
  numEdges: Number,
});

const emit = defineEmits(['close', 'update-options']);

const is3D = ref(true);

watch(() => props.numEdges, (newEdges) => {
  setNumEdges(newEdges);
  if (newEdges !== 6) {
    is3D.value = false;
    onToggle3D();
  }
});

const onUpdate = (key, value) => {
  emit('update-options', {
    ...props,
    [key]: parseInt(value, 10),
  });
};

const onToggle3D = () => {
  toggle3D(is3D.value);
};
</script>

<style scoped>
</style>
