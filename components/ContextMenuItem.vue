<template>
  <template class="menu-item" :style="itemStyle">
    <v-btn
      icon
      :active="display_options"
      @click.stop="display_options = !display_options"
    >
      <slot name="btn" />
      <v-tooltip :location="tooltip_location" :origin="tooltip_origin">
        <span><slot name="tooltip" /></span>
      </v-tooltip>
    </v-btn>
    <v-row v-if="display_options">
      <slot name="options" />
    </v-row>
  </template>
</template>

<script setup>
const props = defineProps({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  tooltip_location: { type: String, required: true },
  tooltip_origin: { type: String, required: true },
  itemStyle: { type: Object, required: true },
});

const display_options = ref(false);
</script>

<style scoped>
.menu-item {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.3s;
}
</style>
