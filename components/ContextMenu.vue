<template>
  <v-menu
    model-value="true"
    content-class="circular-menu"
    :style="getMenuStyle()"
  >
    <div
      class="circular-menu-items"
      :style="{ width: `${radius * 2}px`, height: `${radius * 2}px` }"
    >
      <component
        v-for="(item, index) in menu_items"
        :is="item"
        :key="item"
        :itemProps="{
          x: props.x,
          y: props.y,
          location: getLocation(index, menu_items.length),
          origin: getOrigin(index, menu_items.length),
          itemStyle: getItemStyle(index, menu_items.length),
        }"
      />
    </div>
  </v-menu>
</template>

<script setup>
import { computed } from 'vue';

const menuStore = useMenuStore();
const radius = 80;

const props = defineProps({
  object_type: { type: String, required: true },
  geode_object: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  containerWidth: { type: Number, required: true },
  containerHeight: { type: Number, required: true },
});

const menu_items = computed(() => {
  return menuStore.getMenuItems(props.object_type, props.geode_object);
})


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

  console.log(adjustedX, adjustedY, radius);
  return {
    left: `${adjustedX - radius}px`,
    top: `${adjustedY - radius}px`,
  };
}

function getLocation(index, totalItems) {
  const angle = (index / totalItems) * 360;
  if (angle >= 0 && angle < 90) return "top";
  if (angle >= 90 && angle < 180) return "end";
  if (angle >= 180 && angle < 270) return "bottom";
  return "start";
}

function getOrigin(index, totalItems) {
  const angle = (index / totalItems) * 360;
  if (angle >= 0 && angle < 90) return "start";
  if (angle >= 90 && angle < 180) return "top";
  if (angle >= 180 && angle < 270) return "end";
  return "bottom";
}

function getItemStyle(index, totalItems) {
  const angle = (index / totalItems) * 2 * Math.PI;
  const xRound = Math.cos(angle) * props.radius;
  const yRound = Math.sin(angle) * props.radius;
  return {
    transform: `translate(${xRound}px, ${yRound}px)`,
    transition: "opacity 0.1s ease, transform 0.1s ease",
  };
}

console.log("display_menu", menuStore.display_menu);
console.log("items", menuStore.items);

watch(menuStore.items, (value) => {
  console.log("itemsw", value);
});
watch(menuStore.display_menu, (value) => {
  console.log("display_menuw", value);
});
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
