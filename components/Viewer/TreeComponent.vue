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
            :items="mesh_components"
            return-object
            class="transparent-treeview"
            item-value="id"
            select-strategy="classic"
            selectable
          >
            <template #title="{ item }">
              <span class="treeview-item">{{ item.id }}</span>
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
const dataStyleStore = useDataStyleStore();
const { components_selection } = toRefs(treeviewStore);

const props = defineProps({ id: { type: String, required: true } });

const meta_data = computed(() => treeviewStore.itemMetaDatas(props.id));
const mesh_components = ref([]);
const uuid_dict = ref({});
const previousSelection = ref([]);

onMounted(() => {
  fetchMeshComponents();
  getUuidToFlatIndexDict();

  if (back_schemas?.opengeodeweb_back?.models) {
  } else {
  }
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
          if (response._data && response._data.uuid_dict) {
            const categories = response._data.uuid_dict || {};
            const formattedData = [];

            for (const [category, uuids] of Object.entries(categories)) {
              formattedData.push({
                id: category,
                name: category,
                children: uuids.map((uuid) => ({
                  id: uuid,
                  name: uuid,
                  category,
                })),
              });
            }
            mesh_components.value = formattedData;
            console.log("Mesh Components:", mesh_components.value);
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
    console.error("Failed to fetch mesh components:", error);
  }
}

watch(
  components_selection,
  (current) => {
    const prev = previousSelection.value || [];
    const added = current.filter((item) => !prev.some((p) => p.id === item.id));
    const removed = prev.filter(
      (item) => !current.some((c) => c.id === item.id)
    );

    added.forEach((item) => {
      const flatIndex = uuid_dict.value[item.id];
      if (flatIndex !== undefined) {
        dataStyleStore.setVisibility(props.id, flatIndex, true);
      }
    });
    removed.forEach((item) => {
      const flatIndex = uuid_dict.value[item.id];
      if (flatIndex !== undefined) {
        dataStyleStore.setVisibility(props.id, flatIndex, false);
      }
    });

    previousSelection.value = [...current];
  },
  { immediate: true, deep: true }
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
          if (response._data && response._data.uuid_to_flat_index) {
            uuid_dict.value = response._data.uuid_to_flat_index;
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
  } catch (error) {}
}
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
