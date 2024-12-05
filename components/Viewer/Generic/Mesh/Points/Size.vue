<template>
  <v-card width="200">
    <v-slider
      v-model="size"
      hide-details
      min="0"
      max="20"
      step="2"
      thumb-label
      thumb-color="black"
      ticks
    ></v-slider>
  </v-card>
</template>

<script setup>

// Props
const props = defineProps({
  item: { type: Object, required: true },
});

// Stores
const dataStyleStore = useDataStyleStore();

// Variables
const size = ref(0);

watch(size, (value) => {
  dataStyleStore.setMeshPointsSize({ id: props.item.id, value });
});

onMounted(() => {
  size.value = this.item.style.size;
});
</script>
