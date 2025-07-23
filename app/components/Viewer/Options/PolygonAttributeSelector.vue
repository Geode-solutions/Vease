<template>
  <v-select
    v-model="polygon_attribute_name"
    :items="polygon_attribute_names"
    label="Select an attribute"
    density="compact"
  />
</template>

<script setup>
import back_schemas from "@geode/opengeodeweb-back/opengeodeweb_back_schemas.json";

const dataBaseStore = useDataBaseStore();

const props = defineProps({
  id: { type: String, required: true },
});

const model = defineModel();
const polygon_attribute_name = ref("");
const polygon_attribute_names = ref([]);
const polygon_attribute = reactive({ name: polygon_attribute_name.value });

const meta_data = computed(() => {
  return dataBaseStore.itemMetaDatas(props.id);
});

onMounted(() => {
  if (model.value != null) {
    polygon_attribute_name.value = model.value.name;
  }
});

watch(polygon_attribute_name, (value) => {
  polygon_attribute.name = value;
  model.value = polygon_attribute;
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
