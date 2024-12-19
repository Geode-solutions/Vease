<template>
  <template class="menu-item" :style="itemStyle">
    <v-tooltip
      :location="props.itemProps.tooltip_location"
      :origin="props.itemProps.tooltip_origin"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          icon
          :active="display_options"
          @click.stop="toggleOptions"
          v-bind="props"
        >
          <v-img :src="btn_image" height="35" width="35" />
        </v-btn>
      </template>
      <span>{{ props.tooltip }}</span>
    </v-tooltip>
    <div v-if="display_options" class="menu-options pa-0" @click.stop>
      <v-card :title="props.tooltip" class="bg-primary" width="320" v-click-outside="toggleOptions">
        <v-card-text class="bg-primary">
          <slot name="options" />
        </v-card-text>
      </v-card>
    </div>
  </template>
</template>

<script setup>
const props = defineProps({
  itemProps: { type: Object, required: true },
  tooltip: { type: String, required: true },
  btn_image: { type: String, required: true },
});

console.log("ContextMenuItem props", props.itemProps);

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
