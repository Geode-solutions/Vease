<template>
  <v-row
    v-for="(texture, index) in textures"
    :key="texture"
    justify="left"
    align="center"
  >
    <v-spacer />
    <v-col cols="1" class="pa-0">
      <v-icon
        v-if="textures.length > 1"
        icon="mdi-minus"
        size="20"
        v-tooltip:bottom="'Remove texture'"
        @click="textures.splice(index, 1)"
      />
    </v-col>
    <v-col cols="7" class="pa-1">
      <v-select
        @click.prevent
        v-model="texture.texture_name"
        :items="texture_coordinates"
        label="Select a texture"
        density="compact"
      />
    </v-col>
    <v-col cols="1">
      <!-- texture.texture_file_name =  -->
      <v-badge color="white" floating dot offset-x="-8" offset-y="-8">
        <FileUploader
          @update:files="texture.texture_file_name = $event[0].name"
          :auto_upload="false"
        />
      </v-badge>
    </v-col>

    <v-col
      v-if="texture.texture_name == '' || texture.texture_file_name == ''"
      cols="1"
      class="pa-1"
    >
      <v-icon
        size="20"
        icon="mdi-close-circle"
        v-tooltip:bottom="'Invalid texture'"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-spacer />
    <v-col cols="3">
      <v-icon
        icon="mdi-plus"
        v-tooltip:bottom="'Add a texture'"
        size="20"
        @click="textures.push({ texture_name: '', texture_file_name: '' })"
      />
    </v-col>
  </v-row>
</template>

<script setup>
import back_schemas from "@geode/opengeodeweb-back/schemas.json";

const textures = defineModel();

const props = defineProps({
  id: { type: String, required: true },
});

const texture_coordinates = ref([]);

const tree_view_store = use_treeview_store();

const meta_data = computed(() => {
  return tree_view_store.itemMetaDatas(props.id);
});

onMounted(() => {
  getTextureCoordinates();
});

function getTextureCoordinates() {
  console.log("getTextureCoordinates", back_schemas.opengeodeweb_back);
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
        texture_coordinates.value = ["Lambert2G"];
        // texture_coordinates.value = response._data.texture_coordinates;
      },
    }
  );
}
</script>

<style>
.v-input__details {
  display: none;
}
</style>
