<template>
  <v-select
    v-model="polygon_attribute_name"
    :items="polygon_attribute_names"
    label="Select an attribute"
    density="compact"
  />
</template>

<script setup>
import back_schemas from "@geode/opengeodeweb-back/schemas.json";

const model = defineModel();

const polygon_attribute_name = ref("");

onMounted(() => {
  if (model.value != null) {
    polygon_attribute_name.value = model.value.name;
  }
});
const polygon_attribute = reactive({ name: polygon_attribute_name.value });

watch(polygon_attribute_name, (value) => {
  polygon_attribute.name = value;
  model.value = polygon_attribute;
});

const props = defineProps({
  id: { type: String, required: true },
});

const tree_view_store = use_treeview_store();

const polygon_attribute_names = ref([]);
const meta_data = computed(() => {
  return tree_view_store.itemMetaDatas(props.id);
});

onMounted(() => {
  getVertexAttributes();
});

function getVertexAttributes() {
  api_fetch(
    {
      schema: back_schemas.opengeodeweb_back.polygon_attribute_names,
      params: {
        input_geode_object: meta_data.value.geode_object,
        filename: meta_data.value.native_filename,
      },
    },
    {
      response_function: (response) => {
        polygon_attribute_names.value = response._data.polygon_attribute_names;
      },
    }
  );
}
</script>
