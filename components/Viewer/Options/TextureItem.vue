<template>
  <v-col cols="7" class="pa-1">
    <v-select
      v-model="texture.texture_name"
      :items="texture_coordinates"
      label="Select a texture"
      density="compact"
    />
  </v-col>
  <v-col cols="1">
    <v-badge color="white" floating dot offset-x="-8" offset-y="-8">
      <FileUploader
        @files_uploaded="files_uploaded_event($event, index)"
        :accept="['image/png', 'image/jpeg', 'image/bmp']"
        :auto_upload="true"
        :multiple="true"
        :mini="true"
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
</template>

<script setup>
import back_schemas from "@geode/opengeodeweb-back/schemas.json";

const tree_view_store = use_treeview_store();

const texture = defineModel();

const props = defineProps({
  id: { type: String, required: true },
});

const texture_coordinates = ref([]);

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
        console.log("getTextureCoordinates", response._data);
        texture_coordinates.value = ["Lambert2G"];
        // texture_coordinates.value = response._data.texture_coordinates;
      },
    }
  );
}

async function files_uploaded_event(value) {
  console.log("files_uploaded_event", value);
  if (value.length) {
    await api_fetch(
      {
        schema: back_schemas.opengeodeweb_back.save_viewable_file,
        params: {
          input_geode_object: "RasterImage2D",
          filename: value[0].name,
        },
      },
      {
        response_function: async (response) => {
          console.log("COUCOU files_uploaded_event", response);
          texture.value.texture_file_name = response._data.viewable_file_name;
        },
      }
    );
    console.log("files_uploaded_event", value);
  }
}

watch(texture, (value) => {
  console.log("texture", value);
});
</script>

<style>
.v-input__details {
  display: none;
}
</style>
