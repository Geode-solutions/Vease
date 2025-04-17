<template>
  <v-container
    class="treeview-container"
    :style="{ width: `${treeviewStore.panelWidth}px` }"
  >
    <v-row>
      <div
        class="resizable-panel"
        :style="{ width: `${treeviewStore.panelWidth}px` }"
      >
        <v-sheet
          style="max-height: calc(80vh - 100px)"
          class="transparent-treeview scrollbar"
        >
          <ViewerBreadCrumb
            :selectedTree="selectedTree"
            :treeOptions="treeOptions"
            @update:selectedTree="selectedTree = $event"
          />
          <v-treeview
            v-model:selected="components_selection"
            :items="mesh_components.items"
            return-object
            class="transparent-treeview"
            item-value="id"
            select-strategy="classic"
            selectable
          >
            <template #title="{ item }">
              <span class="treeview-item">{{ item.name }}</span>
            </template>
          </v-treeview>
        </v-sheet>
      </div>
      <div class="resizer" @mousedown="onResizeStart"></div>
    </v-row>
  </v-container>
</template>

<script setup>
import back_schemas from "@geode/opengeodeweb-back/schemas.json";

const treeviewStore = use_treeview_store();
const { components_selection } = toRefs(treeviewStore);

const props = defineProps({ id: { type: String, required: true } });

const meta_data = computed(() => treeviewStore.itemMetaDatas(props.id));
const mesh_components = ref([]);
const uuid_dict = reactive({});

onMounted(() => {
  fetchMeshComponents();
});

async function fetchMeshComponents() {
  try {
    console.log("Fetching mesh components...");
    console.log("Meta Data:", meta_data.value);

    if (!meta_data.value.native_filename || !meta_data.value.geode_object) {
      throw new Error("Missing required meta data");
    }

    await api_fetch(
      {
        schema: back_schemas.opengeodeweb_back.models.mesh_components,
        params: {
          filename: meta_data.value.native_filename,
          geode_object: meta_data.value.geode_object,
        },
      },
      {
        response_function: async (response) => {
          console.log("API Response:", response);
          const categories = response._data || {};
          const formattedData = [];

          for (const [category, uuids] of Object.entries(categories)) {
            formattedData.push({
              id: category,
              name: category,
              children: uuids.map((uuid) => ({ id: uuid, name: uuid })),
            });
          }
          mesh_components.value = formattedData;
          console.log("Mesh Components:", mesh_components.value);
        },
      }
    );
  } catch (error) {
    console.error("Failed to fetch mesh components:", error);
  }
}

function compareSelections(current, previous) {
  const added = current.filter((item) => !previous.includes(item));
  const removed = previous.filter((item) => !current.includes(item));
  return { added, removed };
}

watch(
  components_selection,
  (current, previous) => {
    if (!previous) previous = [];
    const { added, removed } = compareSelections(current, previous);
    added.forEach((item) =>
      dataStyleStore.setMeshComponentVisibility(props.id, uuid, true)
    );
    removed.forEach((item) =>
      dataStyleStore.setMeshComponentVisibility(props.id, uuid, false)
    );
  },
  { immediate: true }
);

function onResizeStart(event) {
  const startWidth = treeviewStore.panelWidth;
  const startX = event.clientX;

  const resize = (e) => {
    const deltaX = e.clientX - startX;
    treeviewStore.setPanelWidth(
      Math.max(150, Math.min(startWidth + deltaX, window.innerWidth))
    );
  };

  const stopResize = () => {
    document.removeEventListener("mousemove", resize);
    document.removeEventListener("mouseup", stopResize);
  };

  document.addEventListener("mousemove", resize);
  document.addEventListener("mouseup", stopResize);
}

async function getUuidToFlatIndexDict() {
  console.log("getUuidToFlatIndexDict", props.id);
  try {
    await api_fetch(
      {
        schema: back_schemas.opengeodeweb_back.models.vtm_component_indices,
        params: {
          id: props.id,
        },
      },
      {
        response_function: async (response) => {
          console.log("Full API Response for UUID dict:", response);
          if (response._data && response._data.uuid_dict) {
            uuid_dict.value = response._data.uuid_dict;
            console.log("UUID dict:", uuid_dict.value);
          } else {
            console.error(
              "UUID dict not found in response data:",
              response._data
            );
          }
        },
      }
    );
  } catch (error) {
    console.error("Failed to fetch UUID dict:", error);
  }
}

onMounted(() => {
  getUuidToFlatIndexDict();
});
</script>

<style scoped>
.treeview-item {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  display: inline-block;
}

.treeview-container {
  position: absolute;
  z-index: 2;
  left: 0;
  top: 0;
  background-color: transparent;
  border-radius: 16px;
  padding: 8px;
  display: flex;
  box-sizing: border-box;
}

.resizable-panel {
  display: inline-block;
  height: 100%;
  overflow-y: auto;
}

.resizer {
  width: 5px;
  cursor: ew-resize;
  height: 100%;
  background-color: transparent;
}

.resizer:hover {
  background-color: #e7e7e7;
}

.transparent-treeview {
  background-color: transparent;
  margin: 4px 0;
}

.scrollbar {
  overflow-y: hidden;
}

:hover.scrollbar {
  overflow-y: auto;
}

.scrollbar::-webkit-scrollbar {
  width: 5px;
  background-color: transparent;
}

.scrollbar::-webkit-scrollbar-thumb {
  background-color: #8d8b8b;
  border-radius: 10px;
}
</style>
