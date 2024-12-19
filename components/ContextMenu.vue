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
        :key="index"
        :itemProps="{
          id: props.id,
          tooltip_location: getTooltipLocation(index),
          tooltip_origin: getTooltipOrigin(index),
        }"
        class="menu-item-wrapper"
        :style="getItemStyle(index)"
      />
    </div>
  </v-menu>
</template>

<script setup>
const menuStore = useMenuStore();
const treeViewStore = use_treeview_store();

const radius = 80;

const props = defineProps({
  id: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  containerWidth: { type: Number, required: true },
  containerHeight: { type: Number, required: true },
});

const show_menu = ref(true);

watch(show_menu, (value) => {
  if (!value) {
    menuStore.closeMenu();
  }
});

const meta_data = computed(() => treeViewStore.itemMetaDatas(props.id));
console.log("meta_data", meta_data);

const menu_items = computed(() =>
  menuStore.getMenuItems(
    meta_data.value.object_type,
    meta_data.value.geode_object
  )
);

const menuItemCount = computed(() => menu_items.value.length);

function getMenuStyle() {
  const adjustedX = Math.min(
    Math.max(props.x, radius),
    props.containerWidth - radius
  );
  const adjustedY = Math.min(
    Math.max(props.y, radius),
    props.containerHeight - radius
  );

  return {
    left: `${adjustedX - radius}px`,
    top: `${adjustedY - radius}px`,
  };
}

function getTooltipLocation(index) {
  const angle = (index / menuItemCount.value) * 360;
  if (angle < 45 || angle >= 315) return "right";
  if (angle >= 45 && angle < 135) return "top";
  if (angle >= 135 && angle < 225) return "left";
  return "bottom";
}

function getTooltipOrigin(index) {
  const angle = (index / menuItemCount.value) * 360;
  if (angle < 45 || angle >= 315) return "left";
  if (angle >= 45 && angle < 135) return "bottom";
  if (angle >= 135 && angle < 225) return "right";
  return "top";
}

function getItemStyle(index) {
  const angle = (index / menuItemCount.value) * 2 * Math.PI;
  return {
    transform: `translate(${Math.cos(angle) * radius}px, ${
      Math.sin(angle) * radius
    }px)`,
    transition: "opacity 0.1s ease, transform 0.1s ease",
    position: "absolute",
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

.menu-item-wrapper {
  position: absolute;
  transform-origin: center;
  will-change: transform, opacity;
}
</style>
