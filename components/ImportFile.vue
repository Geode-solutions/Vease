<template>
  <v-btn
    :loading="loading"
    color="primary"
    @click="import_files()"
    ref="import_button"
  >
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

const dataBaseStore = useDataBaseStore();
const UIStore = useUIStore();

const import_button = useTemplateRef("import_button");
useFocus(import_button, { initialValue: true });

const loading = ref(false);
const toggle_loading = useToggle(loading);

async function import_files() {
  toggle_loading();

  for (const filename of props.filenames) {
    const params = {
      input_geode_object: props.input_geode_object,
      filename,
    };

    await api_fetch(
      { schema: back_schemas.opengeodeweb_back.save_viewable_file, params },
      {
        response_function: async (response) => {
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
                console.log("response", response);
                await dataBaseStore.addItem(response._data.id, {
                  object_type: response._data.object_type,
                  geode_object: props.input_geode_object,
                  native_filename: response._data.native_file_name,
                  viewable_filename: response._data.viewable_file_name,
                  displayed_name: response._data.name,
                });
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
