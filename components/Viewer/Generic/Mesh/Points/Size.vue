<template>
  <ContextMenuItem
    v-bind="itemProps"
    tooltip="Points size"
    :btn_image="props.btn_image"
  >
    <template #options>
      <v-card width="200">
        <v-slider
          v-model="size"
          hide-details
          min="0"
          max="20"
          step="2"
          thumb-label
          thumb-color="black"
          ticks
        ></v-slider>
      </v-card>
    </template>
  </ContextMenuItem>
</template>

<script setup>
const props = defineProps({
  itemProps: { type: Object, required: true },
  btn_image: { type: String, required: true },
});

const dataStyleStore = useDataStyleStore();

const id = toRef(() => props.itemProps.id);
console.log("id", id.value);

const size = computed({
  get() {
    return dataStyleStore.pointsSize(id.value);
  },
  set(newValue) {
    dataStyleStore.setPointsSize(id.value, newValue);
  },
});
</script>
