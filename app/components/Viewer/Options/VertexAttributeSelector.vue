<template>
  <v-select
    v-model="vertex_attribute_name"
    :items="vertex_attribute_names"
    label="Select an attribute"
    density="compact"
  />
</template>

<script setup>
import back_schemas from "@geode/opengeodeweb-back/opengeodeweb_back_schemas.json";

const model = defineModel();

const vertex_attribute_name = ref("");

onMounted(() => {
  if (model.value != null) {
    vertex_attribute_name.value = model.value.name;
  }
});
const vertex_attribute = reactive({ name: vertex_attribute_name.value });

watch(vertex_attribute_name, (value) => {
  vertex_attribute.name = value;
  model.value = vertex_attribute;
});

const props = defineProps({
  id: { type: String, required: true },
});

const dataBaseStore = useDataBaseStore();

const vertex_attribute_names = ref([]);
const meta_data = computed(() => {
  return dataBaseStore.itemMetaDatas(props.id);
});

onMounted(() => {
  getVertexAttributes();
});

function getVertexAttributes() {
  api_fetch(
    {
      schema: back_schemas.opengeodeweb_back.vertex_attribute_names,
      params: {
        input_geode_object: meta_data.value.geode_object,
        filename: meta_data.value.native_filename,
      },
    },
    {
      response_function: (response) => {
        vertex_attribute_names.value = response._data.vertex_attribute_names;
      },
    }
  );
}
</script>
