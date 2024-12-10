<template>
  <v-combobox
    v-model="polygonAttributeName"
    :items="polygonAttributes"
    label="Select attribute"
  ></v-combobox>
</template>

<script setup>
import back_schemas from "@geode/opengeodeweb-back/schemas.json";

const emit = defineEmits(["update_value"]);

const props = defineProps({
  id: { type: String, required: true },
});

const dataStyleStore = useDataStyleStore();

const polygonAttributes = ref([]);
const polygonAttributeName = ref("");
const meta_data = computed(() => {
  return dataStyleStore.getMetaData(props.id);
});

watch(polygonAttributeName, () => {
  emit("update_value", polygonAttributeName.value);
});

onMounted(() => {
  getPolygonAttributeNames();
});

function getPolygonAttributeNames() {
  api_fetch(
    {
      schema: back_schemas.opengeodeweb_back.polygon_attribute_names,
      params: {
        input_geode_object: meta_data.value.geode_object,
        filename: meta_data.value.filename,
      },
    },
    {
      response_function: (response) => {
        polygonAttributes.value = response._data.polygon_attribute_names;
      },
    }
  );
}
</script>
