<template>
  <v-select
    v-model="polyhedron_attribute_name"
    :items="polyhedron_attribute_names"
    label="Select an attribute"
    density="compact"
  />
</template>

<script setup>
import back_schemas from "@geode/opengeodeweb-back/opengeodeweb_back_schemas.json";

const model = defineModel();

const polyhedron_attribute_name = ref("");

onMounted(() => {
  if (model.value != null) {
    polyhedron_attribute_name.value = model.value.name;
  }
});
const polyhedron_attribute = reactive({
  name: polyhedron_attribute_name.value,
});

watch(polyhedron_attribute_name, (value) => {
  polyhedron_attribute.name = value;
  model.value = polyhedron_attribute;
});

const props = defineProps({
  id: { type: String, required: true },
});

const dataBaseStore = useDataBaseStore();

const polyhedron_attribute_names = ref([]);
const meta_data = computed(() => {
  return dataBaseStore.itemMetaDatas(props.id);
});

onMounted(() => {
  getVertexAttributes();
});

function getVertexAttributes() {
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
        polyhedron_attribute_names.value =
          response._data.polyhedron_attribute_names;
      },
    }
  );
}
</script>
