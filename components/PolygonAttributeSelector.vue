<template>
  <v-combobox
    v-model="vertexAttributeName"
    v-if="select === styles[1]"
    :items="vertexAttributes"
    label="Select attribute"
  ></v-combobox>
</template>



<script setup>
import back_schemas from "@geode/opengeodeweb-back/schemas.json";

const props = defineProps({
    id: { type: String, required: true },
})

onMounted(() => {
    getVertexAttributeNames()
})

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
