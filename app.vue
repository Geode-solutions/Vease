<template>
  <v-app>
    <TopBar />
    <v-main class="custom-background">
      <SideBar />
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>
