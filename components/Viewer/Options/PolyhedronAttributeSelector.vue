<template>
  <v-select
    v-model="polyhedronAttributeName"
    :items="polyhedronAttributes"
    label="Select an attribute"
    density="compact"
  />
</template>

<script setup>
import back_schemas from "@geode/opengeodeweb-back/schemas.json";

const polyhedronAttributeName = defineModel();

const props = defineProps({
  id: { type: String, required: true },
});

const tree_view_store = use_treeview_store();

const polyhedronAttributes = ref([]);
const meta_data = computed(() => {
  return tree_view_store.itemMetaDatas(props.id);
});

onMounted(() => {
  getPolyhedronAttributeNames();
});

function getPolyhedronAttributeNames() {
  api_fetch(
    {
      schema: back_schemas.opengeodeweb_back.polyhedron_attribute_names,
      params: {
        input_geode_object: meta_data.value.geode_object,
        filename: meta_data.value.native_filename,
      },
    },
    {
      response_function: (response) => {
        polyhedronAttributes.value = response._data.polyhedron_attribute_names;
      },
    }
  );
}
</script>
