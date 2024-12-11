<template>
  <v-menu
    v-model="show_menu"
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
        v-bind="{
          itemProps: {
            id: props.id,
            x: props.x,
            y: props.y,
            tooltip_location: getTooltipLocation(index, menu_items.length),
            tooltip_origin: getTooltipOrigin(index, menu_items.length),
            itemStyle: getItemStyle(index, menu_items.length),
          },
        }"
        :style="getItemStyle(index, menu_items.length)"
      />
    </div>
  </v-menu>
</template>

<script setup>
const menuStore = useMenuStore();
const radius = 80;

const props = defineProps({
  id: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  containerWidth: { type: Number, required: true },
  containerHeight: { type: Number, required: true },
});

const show_menu = ref(true);

console.log("show_menu", show_menu.value);
watch(show_menu, (value) => {
  console.log("show_menu watch", value);
  menuStore.closeMenu();
});

console.log("ContextMenu props", props);

const tree_view_store = use_treeview_store();
const meta_data = computed(() => {
  return tree_view_store.idMetaData(props.id);
});

console.log("meta_data", meta_data);

const menu_items = computed(() => {
  console.log("META_DATA", meta_data);
  const value = menuStore.getMenuItems(
    meta_data.value.object_type,
    meta_data.value.geode_object
  );

  // const value = menuStore.getMenuItems("mesh", "PolygonalSurface3D");
  console.log("menu_items", value);
  return value;
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

  console.log(adjustedX, adjustedY, radius);
  return {
    left: `${adjustedX - radius}px`,
    top: `${adjustedY - radius}px`,
  };
}

function getTooltipLocation(index, totalItems) {
  const angle = (index / totalItems) * 360;
  if (angle >= 0 && angle < 90) return "top";
  if (angle >= 90 && angle < 180) return "end";
  if (angle >= 180 && angle < 270) return "bottom";
  return "start";
}

function getTooltipOrigin(index, totalItems) {
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
