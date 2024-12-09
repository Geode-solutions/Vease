<template>
  <div class="menu-item" :style="props.itemStyle">
    <v-btn icon :active="display_options" v-bind="props" @click.stop="display_options = !display_options">
      <slot name="btn" />
      <v-tooltip :location="props.location" :origin="props.origin">
        <span><slot name="tooltip" /></span>
      </v-tooltip>
    </v-btn>
    <v-row>


      <slot name="options" v-if="display_options" />
    </v-row>
  </div>
</template>

<script setup>
const props = defineProps({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  location: { type: String, required: true },
  origin: { type: String, required: true },
  itemStyle: { type: String, required: true },
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
.clickable-area {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transition: background-color 0.3s;
}

.clickable-area:hover {
  background-color: rgba(255, 255, 255, 0.5);
}
</style>
