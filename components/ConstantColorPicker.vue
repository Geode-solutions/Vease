<template>
  <v-color-picker
    ref="el"
    v-model="color"
    flat
    canvas-height="100"
    hide-inputs
    width="200"
  />
</template>

<script setup>
const el = ref(null);
const model = defineModel();
const { pressed } = useMousePressed({ target: el });

const color = ref({
  r: 0,
  g: 0,
  b: 0,
  a: 1,});

watch(pressed, (value) => {
  console.log("pressed", value);

  if (!value) {
    console.log("color", color.value);

    model.value = color.value;
    console.log("model", model.value);
  }
});
</script>
