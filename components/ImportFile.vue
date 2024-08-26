<template>
  <v-btn :loading="loading" color="primary" @click="import_files()">
    Import
    <template #loader>
      <v-progress-circular indeterminate size="20" color="white" width="3" />
    </template>
  </v-btn>
  <v-btn variant="text" @click="$emit('decrement_step')"> Cancel </v-btn>
</template>

<script setup>
import schemas from "@geode/opengeodeweb-viewer/schemas.json";
import schema from "@geode/opengeodeweb-back/schemas.json";

const emit = defineEmits(["update_values", "increment_step", "decrement_step"]);

const props = defineProps({
  filenames: { type: Array, required: true },
  input_geode_object: { type: String, required: true },
});

const { filenames, input_geode_object } = props;

const loading = ref(false);
const toggle_loading = useToggle(loading);

async function import_files() {
  toggle_loading();
  for (const filename of filenames) {
    const params = {
      input_geode_object,
      filename,
    };

    await api_fetch(
      { schema: schema.opengeodeweb_back.save_viewable_file, params },
      {
        requestErrorFunction: () => {},
        response_function: async (response) => {
          await viewer_call({
            schema: schemas.opengeodeweb_viewer.create_object_pipeline,
            params: {
              id: response._data.id,
              file_name: response._data.viewable_file_name,
            },
          });
        },
      }
    );
  }
  toggle_loading();
}
</script>
