<template>
  <v-navigation-drawer
    v-model="drawer"
    :width="50"
    class="mt-10 ma-2"
    color="#FFFFFF00"
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
          icon
          color="#FFFFFF00"
          :class="item.title === 'Back' ? 'mb-8' : 'mb-1'"
          @click="item.title === 'Back' ? goBack() : null"
          class="icon-style"
          height="50px"
          width="50px"
        >
          <v-icon
            class="icon-style pa-6"
            :icon="item.icon"
            color="white"
            height="50px"
            width="50px"
            size="28"
          />
        </v-btn>
      </template>
    </v-tooltip>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

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
</script>

<style scoped>
.page_background {
  background: rgb(56, 157, 133);
  background: linear-gradient(
    135deg,
    rgba(56, 157, 133, 1) 0%,
    rgba(0, 0, 0, 1) 100%
  );
}
.icon-style {
  border-radius: 20%;
  background-color: #ffffff26;
}
</style>
