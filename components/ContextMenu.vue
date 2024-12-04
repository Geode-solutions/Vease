<template>
  <v-menu
    v-model="menuStore.display_menu"
    content-class="circular-menu"
    :style="getMenuStyle()"
  >
    <div
      class="circular-menu-items"
      :style="{ width: `${radius * 2}px`, height: `${radius * 2}px` }"
    >
      <component
        v-for="(item, index) in menuStore.items"
        :is="item"
        :key="item"
        :item="item"
        :index="index"
        :radius="radius"
        :totalItems="menuStore.items.length"
      ></component>
      <!-- <ContextMenuItem
        v-for="(item, index) in menuStore.items"
        :key="item"
        :item="item"
        :index="index"
        :radius="radius"
        :totalItems="menuStore.items.length"
      /> -->
    </div>
  </v-menu>
</template>

<script setup>
const menuStore = useMenuStore();
const radius = 80;

const props = defineProps({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  containerWidth: { type: Number, required: true },
  containerHeight: { type: Number, required: true },
});

function getMenuStyle() {
  let adjustedX = props.x;
  let adjustedY = props.y;

  if (adjustedX - radius < 0) {
    adjustedX = radius;
  } else if (adjustedX + radius > props.containerWidth) {
    adjustedX = props.containerWidth - radius;
  }

  if (adjustedY - radius < 0) {
    adjustedY = radius;
  } else if (adjustedY + radius > props.containerHeight) {
    adjustedY = props.containerHeight - radius;
  }

  return {
    left: `${adjustedX - radius}px`,
    top: `${adjustedY - radius}px`,
  };
}
</script>

<style scoped>
.circular-menu {
  position: absolute;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.8);
}

.circular-menu-items {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
