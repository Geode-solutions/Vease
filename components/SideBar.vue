<template>
  <v-navigation-drawer
    fixed
    v-model="drawer"
    width="70"
    class="mt-10 ma-2"
    color="#FFFFFF00"
    elevation="0"
    floating
    app
    permanent
  >
    <div>
      <v-tooltip
        v-for="(item, index) in items"
        :key="item.id"
        :text="item.title"
      >
        <template v-slot:activator="{ props }">
          <div
            draggable="true"
            @dragstart="startDrag($event, item)"
            @drop="onDrop($event, index)"
            @dragover.prevent
            v-bind="attrs"
            v-on="on"
          >
            <v-btn
              v-bind="props"
              flat
              color="#FFFFFF00"
              @click="item.click"
              style="border-radius: 20%"
              :icon="item.icon"
              class="mb-1"
            >
              <v-icon
                class="icon-style pa-6"
                :icon="item.icon"
                color="white"
                size="28"
              />
            </v-btn>
          </div>
        </template>
      </v-tooltip>
    </div>

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

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const drawer = ref(true);
    const newproject = ref(false);
    const openproject = ref(false);
    const router = useRouter();
    const items = ref([
      {
        id: 1,
        title: "Back",
        icon: "mdi-arrow-left",
        click: () => router.go(-1),
      },
      {
        id: 2,
        title: "Home",
        icon: "mdi-home",
        click: () => router.push("/"),
      },
      {
        id: 3,
        title: "New Project",
        icon: "mdi-plus",
        click: () => (newproject.value = true),
      },
      {
        id: 4,
        title: "Open Project",
        icon: "mdi-folder-outline",
        click: () => (openproject.value = true),
      },
      {
        id: 5,
        title: "Supperposition",
        icon: "mdi-layers",
        click: () => router.push("/supperposition"),
      },
      {
        id: 6,
        title: "Download",
        icon: "mdi-upload",
        click: () => router.push("/download"),
      },
      {
        id: 7,
        title: "Extensions",
        icon: "mdi-puzzle",
        click: () => router.push("/extensions"),
      },
      {
        id: 8,
        title: "Settings",
        icon: "mdi-cog",
        click: () => router.push("/settings"),
      },
    ]);

    let draggedItem = null;

    const startDrag = (event, item) => {
      draggedItem = item;
    };

    const onDrop = (event, dropIndex) => {
      const dragIndex = items.value.findIndex((item) => item === draggedItem);
      if (dragIndex === dropIndex) return;

      items.value.splice(dragIndex, 1);
      items.value.splice(dropIndex, 0, draggedItem);
      draggedItem = null;
    };

    return {
      drawer,
      newproject,
      openproject,
      items,
      startDrag,
      onDrop,
    };
  },
};
</script>
