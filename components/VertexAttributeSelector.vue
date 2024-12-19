<template>
  <v-select
    v-model="vertexAttributeName"
    :items="vertexAttributes"
    label="Select an attribute"
  ></v-select>
</template>

<script setup>
import back_schemas from "@geode/opengeodeweb-back/schemas.json";


const vertexAttributeName = defineModel()

const props = defineProps({
  id: { type: String, required: true },
});

const tree_view_store = use_treeview_store();

const vertexAttributes = ref([]);
const meta_data = computed(() => {
  return tree_view_store.itemMetaDatas(props.id);
});

console.log("meta_data", meta_data);

onMounted(() => {
  getVertexAttributeNames();
});

function getVertexAttributeNames() {
  api_fetch(
    {
      schema: back_schemas.opengeodeweb_back.vertex_attribute_names,
      params: {
        input_geode_object: meta_data.value.geode_object,
        filename: meta_data.value.filename,
      },
    },
    {
      response_function: (response) => {
        vertexAttributes.value = response._data.vertex_attribute_names;
      },
    }
  );
}
</script>
