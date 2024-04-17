<template>
  <v-navigation-drawer
    fixed
    v-model="drawer"
    width="50"
    class="mt-10 ma-2"
    color="#FFFFFF00"
    height="100%"
    elevation="0"
    absolute
    floating
    app
  >
    <v-tooltip
      v-for="(item, index) in items"
      :key="item.title"
      :text="item.title"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          flat
          color="#FFFFFF00"
          :class="item.title === 'Back' ? 'mb-8' : 'mb-1'"
          @click="item.click"
          style="border-radius: 20%"
          :icon="item.icon"
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
    <v-dialog v-model="newproject" max-width="800px" class="text-center">
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
    </v-dialog>

    <v-dialog v-model="openproject" max-width="800px" class="text-center">
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
    </v-dialog>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
const drawer = ref(true);
const router = useRouter();
const newproject = ref(false);
const openproject = ref(false);
const items = [
  { title: "Back", icon: "mdi-arrow-left", click: () => router.go(-1) },
  { title: "Home", icon: "mdi-home", click: () => router.push("/") },
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
    click: () => router.push("/supperposition"),
  },
  {
    title: "Download",
    icon: "mdi-upload",
    click: () => router.push("/download"),
  },
  {
    title: "Extensions",
    icon: "mdi-puzzle",
    click: () => router.push("/extensions"),
  },
  { title: "Settings", icon: "mdi-cog", click: () => router.push("/settings") },
];
</script>
