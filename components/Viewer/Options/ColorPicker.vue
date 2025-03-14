<template>
  <v-color-picker
    ref="el"
    v-model="color"
    flat
    canvas-height="100"
    hide-inputs
    width="100%"
    mode="rgb"
  />
</template>

<script setup>
const el = useTemplateRef("el");
const model = defineModel();
const { pressed } = useMousePressed({ target: el });

const color = ref(model);

watch(pressed, (value) => {
  if (!value) {
    model.value = color.value;
  }
});
</script>
