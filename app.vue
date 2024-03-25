<template>
  <v-app>
    <TopBar />
    <v-main class="custom-background">
      <SideBar />
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import TopBar from "./components/TopBar.vue";
import SideBar from "./components/SideBar.vue";

export default {
  components: {
    TopBar,
    SideBar,
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Michroma&display=swap");

* {
  font-family: "Michroma", sans-serif;
}
.custom-background {
  background: linear-gradient(
    135deg,
    rgba(56, 157, 133, 1) 0%,
    rgba(0, 0, 0, 1) 100%
  );
}
</style>
