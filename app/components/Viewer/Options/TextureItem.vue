<template>
  <v-col cols="7" class="pa-1 ml-3">
    <v-select
      v-model="texture_name"
      :items="texture_coordinates"
      label="Select a texture"
      density="compact"
    />
  </v-col>
  <v-badge
    :model-value="texture_file_name != ''"
    color="white"
    floating
    dot
    offset-x="10"
    offset-y="10"
  >
    <v-col cols="1" class="ma-1" justify="center" align="center">
      <FileUploader
        @files_uploaded="files_uploaded_event($event, index)"
        :accept="['image/png', 'image/jpeg', 'image/bmp']"
        :auto_upload="true"
        :multiple="true"
        :mini="true"
        class="mt-2"
      />
    </v-col>
  </v-badge>
  <v-col v-if="texture_name == '' || texture_file_name == ''" cols="1">
    <v-icon
      size="20"
      icon="mdi-close-circle"
      v-tooltip:bottom="'Invalid texture'"
    />
  </v-col>
</template>

<script setup>
import back_schemas from "@geode/opengeodeweb-back/opengeodeweb_back_schemas.json";

const dataBaseStore = useDataBaseStore();

const emit = defineEmits(["update_value"]);

const props = defineProps({
  id: { type: String, required: true },
  texture_name: { type: String, required: true },
  texture_file_name: { type: String, required: true },
});

const texture_name = ref("");
texture_name.value = props.texture_name;

const texture_file_name = ref("");
texture_file_name.value = props.texture_file_name;

const texture_coordinates = ref([]);

const meta_data = computed(() => {
  return dataBaseStore.itemMetaDatas(props.id);
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

async function files_uploaded_event(value) {
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
          texture_file_name.value = response._data.viewable_file_name;
        },
      }
    );
  }
}

watch(texture_name, (value) => {
  emit("update_value", { key: "texture_name", value });
});

watch(texture_file_name, (value) => {
  emit("update_value", { key: "texture_file_name", value });
});
</script>

<style>
.v-input__details {
  display: none;
}
</style>
