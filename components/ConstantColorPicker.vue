<template>
  <v-color-picker
    v-model="color"
    flat
    canvas-height="100"
    hide-inputs
    width="200"
  />
</template>

<script setup>
const color = defineModel();
</script>
