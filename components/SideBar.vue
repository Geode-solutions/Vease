<template>
  <v-navigation-drawer
    position-fixed
    v-model="drawer"
    :width="50"
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
          @click="
            item.title === 'Home'
              ? goHome()
              : item.title === 'Back'
              ? goBack()
              : item.title === 'Open Project'
              ? openFileDialog()
              : null
          "
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
    <input
      type="file"
      id="fileInput"
      style="display: none"
      @change="fileSelected"
    />
  </v-navigation-drawer>
</template>

<script setup>
const drawer = ref(true);
const router = useRouter();

const items = [
  { title: "Back", icon: "mdi-arrow-left" },
  { title: "Home", icon: "mdi-home" },
  { title: "New Project", icon: "mdi-plus" },
  { title: "Open Project", icon: "mdi-folder-outline" },
  { title: "Supperposition", icon: "mdi-layers" },
  { title: "Download", icon: "mdi-upload" },
  { title: "Extensions", icon: "mdi-puzzle" },
  { title: "Settings", icon: "mdi-cog" },
];

function goBack() {
  router.go(-1);
}

function openFileDialog() {
  document.getElementById("fileInput").click();
}

function fileSelected(event) {
  const file = event.target.files[0];
}

function goHome() {
  router.push("/");
}
</script>
