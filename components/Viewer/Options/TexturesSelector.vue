<template>
  <v-row v-for="texture in textures">
    <v-col cols="5">
      <v-select
        v-model="texture.texture_name"
        :items="texture_coordinates"
        label="Select a texture"
      />
    </v-col cols="5">

    <v-col>
      <FileUploader @update:files="texture.texture_file_name = $event[0]"/>
    </v-col>
    <v-col v-if="texture.texture_name=='' || texture.texture_file_name==''" cols="2">
      <v-icon size="30" icon="mdi-close" v-tooltip:left="'Invalid texture'" />
    </v-col>
  </v-row>
</template>

<script setup>
import back_schemas from "@geode/opengeodeweb-back/schemas.json";

const textures = defineModel();
textures.default = [{ texture_name: "", texture_file_name: "" }];
const props = defineProps({
  id: { type: String, required: true },
});

const texture_coordinates = ref([])

const tree_view_store = use_treeview_store();

const meta_data = computed(() => {
  return tree_view_store.itemMetaDatas(props.id);
});

onMounted(() => {
  getTextureCoordinates();
});

function getTextureCoordinates() {
  api_fetch(
    {
      schema: back_schemas.opengeodeweb_back.texture_coordinates,
      params: {
        input_geode_object: meta_data.value.geode_object,
        filename: meta_data.value.native_filename,
      },
    },
    {
      response_function: (response) => {
        texture_coordinates.value = response._data.texture_coordinates;
      },
    }
  );
}
</script>
