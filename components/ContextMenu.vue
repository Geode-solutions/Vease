<template>
  <v-menu
    v-model="menuStore.menu"
    content-class="circular-menu"
    :style="getMenuStyle()"
  >
    <div
      class="circular-menu-items"
      :style="{ width: `${radius * 2}px`, height: `${radius * 2}px` }"
    >
      <div
        v-for="(item, index) in menuStore.items"
        :key="index"
        class="menu-item"
        :style="getItemStyle(index)"
        :class="{ visible: item.visible }"
        ref="menuItems"
      >
        <v-tooltip
          v-model="tooltipStates[index]"
          :location="getLocation(index)"
          :origin="getOrigin(index)"
          :open-on-hover="false"
        >
          <template v-slot:activator="{ props }">
            <div
              class="clickable-area"
              v-bind="props"
              @click.stop="toggleTooltip(index)"
              :tooltip="item.title"
            >
              <v-icon>{{ item.icon }}</v-icon>
            </div>
          </template>
          <v-card
            max-width="250"
            class="elevation-1"
            :title="item.title"
            :text="'Content for ' + item.title"
          >
            <v-card-actions>
              <v-btn color="primary" @click="closeCard(index)">Fermer</v-btn>
            </v-card-actions>
          </v-card>
        </v-tooltip>
      </div>
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

const tooltipStates = ref(menuStore.items.map(() => false));

function getItemStyle(index) {
  const angle = (index / menuStore.items.length) * 2 * Math.PI;
  const xRound = Math.cos(angle) * radius;
  const yRound = Math.sin(angle) * radius;
  return {
    transform: `translate(${xRound}px, ${yRound}px)`,
    opacity: menuStore.items[index].visible ? 1 : 0,
    transition: "opacity 0.1s ease, transform 0.1s ease",
  };
}

function getLocation(index) {
  const angle = (index / menuStore.items.length) * 360;
  if (angle >= 0 && angle < 90) return "top";
  if (angle >= 90 && angle < 180) return "end";
  if (angle >= 180 && angle < 270) return "bottom";
  return "start";
}

function getOrigin(index) {
  const angle = (index / menuStore.items.length) * 360;
  if (angle >= 0 && angle < 90) return "start";
  if (angle >= 90 && angle < 180) return "top";
  if (angle >= 180 && angle < 270) return "end";
  return "bottom";
}

function toggleTooltip(index) {
  tooltipStates.value[index] = !tooltipStates.value[index];
}

function closeCard(index) {
  tooltipStates.value[index] = false;
}

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
