<template>
    <ContextMenuItem v-bind="itemProps">
      <template #tooltip>Edges size</template>
      <template #btn>
        <slot name="btn"></slot>
      </template>
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
  });
  
  const dataStyleStore = useDataStyleStore();
  
  const id = toRef(() => props.itemProps.id);
  console.log("id", id.value);
  
  const size = computed({
    get() {
      return dataStyleStore.edgesSize(id.value);
    },
    set(newValue) {
      dataStyleStore.setEdgesSize(id.value, newValue);
    },
  });
  </script>