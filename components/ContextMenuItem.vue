<template>
  <div
    class="menu-item"
    :style="getItemStyle"
    :class="{ visible: item.visible }"
    @click.stop="handleClick"
  >
    <v-tooltip
      v-model="tooltipState"
      :location="getLocation"
      :origin="getOrigin"
      :open-on-hover="false"
    >
      <template v-slot:activator="{ props }">
        <div class="clickable-area" v-bind="props" @click.stop="toggleTooltip">
          <v-icon>{{ item.icon }}</v-icon>
        </div>
      </template>
      <div v-if="item.contentType === 'card'">
        <v-card
          max-width="250"
          class="elevation-1"
          :title="item.content.title"
          :text="item.content.text"
        >
          <v-card-actions>
            <v-btn color="primary" @click="closeCard">Fermer</v-btn>
          </v-card-actions>
        </v-card>
      </div>
      <div v-else-if="item.contentType === 'text'">
        <v-card max-width="250" class="elevation-1">
          <v-card-text>{{ item.content.text }}</v-card-text>
        </v-card>
      </div>
      <div v-else-if="item.contentType === 'colorpicker'">
        <v-card max-width="250" class="elevation-1">
          <v-card-text>
            <input type="color" v-model="item.content.color" />
          </v-card-text>
        </v-card>
      </div>
    </v-tooltip>
  </div>
</template>

<script setup>
const props = defineProps({
  item: { type: Object, required: true },
  index: { type: Number, required: true },
  radius: { type: Number, required: true },
  totalItems: { type: Number, required: true },
});

const menuStore = useMenuStore();
const tooltipState = ref(false);

const getItemStyle = computed(() => {
  const angle = (props.index / props.totalItems) * 2 * Math.PI;
  const xRound = Math.cos(angle) * props.radius;
  const yRound = Math.sin(angle) * props.radius;
  return {
    transform: `translate(${xRound}px, ${yRound}px)`,
    opacity: props.item.visible ? 1 : 0,
    transition: "opacity 0.1s ease, transform 0.1s ease",
  };
});

const getLocation = computed(() => {
  const angle = (props.index / props.totalItems) * 360;
  if (angle >= 0 && angle < 90) return "top";
  if (angle >= 90 && angle < 180) return "end";
  if (angle >= 180 && angle < 270) return "bottom";
  return "start";
});

const getOrigin = computed(() => {
  const angle = (props.index / props.totalItems) * 360;
  if (angle >= 0 && angle < 90) return "start";
  if (angle >= 90 && angle < 180) return "top";
  if (angle >= 180 && angle < 270) return "end";
  return "bottom";
});

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
