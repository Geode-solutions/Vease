<template style="overflow-y: hidden">
  <v-app>
    <TopBar />
    <SideBar />
    <v-main class="page_background"> <router-view></router-view> </v-main>
  </v-app>
</template>

<style scoped>
.page_background {
  background: rgb(56, 157, 133);
  background: linear-gradient(
    135deg,
    rgba(56, 157, 133, 1) 0%,
    rgba(0, 0, 0, 1) 100%
  );
}
</style>
