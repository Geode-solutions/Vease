<template>
  <ContextMenuItem v-bind="$attrs">
    <template #tooltip> points size </template>

    <!-- <template #btn="{ btnStyle }">
      <logo-points-size
        :style="{ height: btnStyle.height, width: btnStyle.width }"
      />
    </template> -->

    <template #option>
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
// import LogoPointsSize from "../../assets/point_set_size.svg";

// Props
const props = defineProps({
  item: { type: Object, required: true },
});

// Stores
const dataStyleStore = useDataStyleStore();

// Variables
const size = ref(0);

watch(size, (value) => {
  dataStyleStore.setMeshPointsSize({ id: props.item.id, value });
});

onMounted(() => {
  size.value = this.item.style.size;
});
</script>
