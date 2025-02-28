<template>
  <v-navigation-drawer
    class="rounded align-start"
    radius="10px"
    :width="500"
    location="right"
    temporary
    v-model="UIStore.showCreatePointMenu"
  >
    <v-card :width="500" class="justify-center">
      <v-card-title>Create Point</v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field
            label="Title"
            v-model="point.title"
            type="text"
            :rules="[(v) => !!v || 'Title is required']"
          />
          <v-text-field
            label="X"
            v-model="point.x"
            type="text"
            :rules="[(v) => !!v || 'X is required']"
            @paste="handlePaste"
            @input="sanitizeInput($event, 'x')"
          />
          <v-text-field
            label="Y"
            v-model="point.y"
            type="text"
            :rules="[(v) => !!v || 'Y is required']"
            @paste="handlePaste"
            @input="sanitizeInput($event, 'y')"
          />
          <v-text-field
            label="Z"
            v-model="point.z"
            type="text"
            :rules="[(v) => !!v || 'Z is required']"
            @paste="handlePaste"
            @input="sanitizeInput($event, 'z')"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" :loading="loading" @click="createPoint">
          Create Point
          <template #loader>
            <v-progress-circular
              indeterminate
              size="20"
              color="white"
              width="3"
            />
          </template>
        </v-btn>
        <v-btn variant="text" @click="closeDrawer">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-navigation-drawer>
</template>

<script setup>
import back_schemas from "@geode/opengeodeweb-back/schemas.json";
import viewer_schemas from "@geode/opengeodeweb-viewer/schemas.json";

const UIStore = useUIStore();
const treeviewStore = use_treeview_store();

const props = defineProps({
  id: { type: String, required: true },
});

const point = ref({
  title: null,
  x: null,
  y: null,
  z: null,
});

const loading = ref(false);
const toggleLoading = () => (loading.value = !loading.value);

const closeDrawer = () => {
  UIStore.setShowCreatePointMenu(false);
};

async function createPoint() {
  toggleLoading();

  // try {
  await api_fetch(
    {
      schema: back_schemas.opengeodeweb_back.create_point,
      params: {
        x: parseFloat(point.value.x),
        y: parseFloat(point.value.y),
        z: parseFloat(point.value.z),
        title: point.value.title,
      },
    },
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
              await treeviewStore.addItem(
                response._data.geode_object,
                response._data.name,
                response._data.id,
                response._data.object_type,
                response._data.native_file_name
              );

              toggleLoading();
              closeDrawer();
            },
          }
        );
      },
    }
  );
}

const handlePaste = (event) => {
  const pastedText = event.clipboardData.getData("text");
  const coordinates = pastedText.match(/[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?/g);

  if (coordinates && coordinates.length >= 3) {
    point.value.x = coordinates[0];
    point.value.y = coordinates[1];
    point.value.z = coordinates[2];
  }

  event.preventDefault();
};

const sanitizeInput = (event, label) => {
  let value = event.target.value;
  value = value.replace(/,/g, ".");
  value = value.replace(/[^0-9eE+\-.]/g, "");

  if (/[eE]/.test(value)) {
    const parts = value.split(/[eE]/);
    if (parts.length > 2) {
      value =
        parts.slice(0, 2).join("e") +
        parts
          .slice(2)
          .join("")
          .replace(/[^0-9\+\-\.]/g, "");
    }
  }

  point.value[label] = value;
};
</script>
