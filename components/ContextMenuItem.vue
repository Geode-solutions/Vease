<template>
  <template class="menu-item" :style="itemStyle">
    <v-btn icon :active="display_options" @click.stop="toggleOptions">
      <slot name="btn" />
      <v-tooltip :location="tooltip_location" :origin="tooltip_origin">
        <span><slot name="tooltip" /></span>
      </v-tooltip>
    </v-btn>
    <div v-if="display_options" class="menu-options" @click.stop>
      <slot name="options" />
    </div>
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

function toggleOptions() {
  display_options.value = !display_options.value;
}
</script>

<style scoped>
.menu-item {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.menu-options {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  z-index: 10;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  min-width: 150px;
  max-width: 300px;
  padding: 8px 0;
  overflow: hidden;
}

.menu-options ::v-deep(v-list-item) {
  padding: 10px 16px;
  white-space: nowrap; /* Empêche les retours à la ligne */
}

.menu-options ::v-deep(v-list-item:hover) {
  background-color: #f5f5f5;
  cursor: pointer;
}
</style>
