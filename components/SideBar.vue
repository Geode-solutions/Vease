<template>
  <v-navigation-drawer
    fixed
    v-model="drawer"
    width="70"
    align="center"
    class="mt-10 ma-2"
    color="#FFFFFF00"
    elevation="0"
    floating
    app
    permanent
  >
    <v-tooltip v-for="(item, index) in items" :key="index" :text="item.title">
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          flat
          color="#FFFFFF00"
          @click="item.click"
          style="border-radius: 20%"
          :icon="item.icon"
          class="mb-1"
          draggable="true"
          @dragstart="startDrag($event, item)"
          @drop="onDrop($event, index)"
          @dragover.prevent
          data-type="sidebar-icon"
        >
          <v-icon
            class="icon-style pa-6"
            :icon="item.icon"
            color="white"
            size="28"
          />
        </v-btn>
      </template>
    </v-tooltip>

    <v-dialog
      v-model="newproject"
      max-width="800px"
      radius="20px"
      class="text-center"
    >
      <v-sheet border="md">
        <v-card color="#3c9983">
          <v-card-title>
            <h3 class="mt-4">New Project</h3>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col>
                  <v-text-field label="Project Name" required></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions justify-center>
            <v-btn
              variant="outlined"
              color="white"
              text
              @click="newproject = false"
              class="ml-8 mb-4"
              >Close</v-btn
            >
            <v-btn
              variant="outlined"
              class="mb-4"
              color="white"
              text
              @click="newproject = false"
              >Create</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-sheet>
    </v-dialog>
    <v-dialog v-model="openproject" max-width="800px" class="text-center">
      <v-sheet border="md">
        <v-card color="#3c9983">
          <v-card-title>
            <h3 class="mt-4">Open Project</h3>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col>
                  <v-file-input label="Open Project" required></v-file-input>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions justify-center>
            <v-btn
              variant="outlined"
              color="white"
              text
              @click="openproject = false"
              class="ml-8 mb-4"
              >Close</v-btn
            >
            <v-btn
              variant="outlined"
              class="mb-4"
              color="white"
              text
              @click="openproject = false"
              >Load</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-sheet>
    </v-dialog>
  </v-navigation-drawer>
</template>

<script setup>
const drawer = ref(true);
const newproject = ref(false);
const openproject = ref(false);
const router = useRouter();

const items = ref([
  {
    title: "Home",
    icon: "mdi-home",
    click: () => navigateTo("/"),
  },
  {
    title: "New Project",
    icon: "mdi-plus",
    click: () => (newproject.value = true),
  },
  {
    title: "Open Project",
    icon: "mdi-folder-outline",
    click: () => (openproject.value = true),
  },
  {
    title: "Supperposition",
    icon: "mdi-layers",
    click: () => navigateTo("/supperposition"),
  },
  {
    title: "Download",
    icon: "mdi-upload",
    click: () => navigateTo("/download"),
  },
  {
    title: "Settings",
    icon: "mdi-cog",
    click: () => navigateTo("/settings"),
  },
]);

let draggedItem = null;

const startDrag = (event, item) => {
  draggedItem = item;
  event.dataTransfer.setData("text/plain", "sidebar-icon");
};

const onDrop = (event, dropIndex) => {
  const dragIndex = items.value.findIndex((item) => item === draggedItem);
  if (dragIndex === dropIndex) return;

  items.value.splice(dragIndex, 1);
  items.value.splice(dropIndex, 0, draggedItem);
  draggedItem = null;
};
</script>
