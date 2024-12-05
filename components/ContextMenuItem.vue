<template>
  <div
    class="menu-item"
    :style="props.itemStyle"
    @click.stop="handleClick"
  >
    <v-tooltip
      v-model="tooltipState"
      :location="props.location"
      :origin="props.origin"
      :open-on-hover="false"
    >
      <template v-slot:activator="{ props }">
        <div class="clickable-area" v-bind="props" @click.stop="toggleTooltip">
          <slot name="btn" />
        </div>
      </template>

      <v-card
        max-width="250"
        class="elevation-1"
      >
        <v-card-text>
          <slot name="options" />
        </v-card-text>

        <v-card-actions>
          <v-btn color="primary" @click="closeCard">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-tooltip>
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

const menuStore = useMenuStore();
const tooltipState = ref(false);

function toggleTooltip() {
  tooltipState.value = !tooltipState.value;
}
function closeCard() {
  tooltipState.value = false;
}
function handleClick() {
  menuStore.handleClick(props.item);
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
  transition: transform 0.3s;
}

.menu-item:hover {
  transform: scale(1.2);
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
