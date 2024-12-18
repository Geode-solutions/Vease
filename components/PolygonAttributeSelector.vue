<template>
  <v-select
    v-model="polygonAttributeName"
    :items="polygonAttributes"
    label="Select an attribute"
  ></v-select>
</template>

<script setup>
import back_schemas from "@geode/opengeodeweb-back/schemas.json";

const polygonAttributeName = defineModel()

const props = defineProps({
  id: { type: String, required: true },
});

const tree_view_store = use_treeview_store();

const polygonAttributes = ref([]);
const meta_data = computed(() => {
  return tree_view_store.itemMetaDatas(props.id);
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
