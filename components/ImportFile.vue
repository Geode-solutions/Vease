<template>
  <v-btn :loading="loading" color="primary" @click="import_files()">
    Import
    <template #loader>
      <v-progress-circular indeterminate size="20" color="white" width="3" />
    </template>
  </v-btn>
  <v-btn variant="text" @click="UIStore.setShowStepper(false)"> Cancel </v-btn>
</template>

<script setup>
import viewer_schemas from "@geode/opengeodeweb-viewer/schemas.json";
import back_schemas from "@geode/opengeodeweb-back/schemas.json";

const emit = defineEmits(["update_values", "increment_step", "decrement_step"]);

const props = defineProps({
  filenames: { type: Array, required: true },
  input_geode_object: { type: String, required: true },
});

const treeviewStore = use_treeview_store();
const UIStore = useUIStore();

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
      { schema: back_schemas.opengeodeweb_back.save_viewable_file, params },
      {
        response_function: async (response) => {
          console.log("response", response);
          await viewer_call(
            {
              schema: viewer_schemas.opengeodeweb_viewer.generic.register,
              params: {
                id: response._data.id,
                file_name: response._data.viewable_file_name,
                viewer_object: response._data.object_type,
              },
            },
            {
              response_function: async () => {
                await treeviewStore.addItem(input_geode_object, response._data.name, response._data.id, response._data.object_type);
              },
            }
          );
        },
      }
    );
  }

  UIStore.setShowStepper(false);
  toggle_loading();
}
</script>
