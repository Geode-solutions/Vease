<template>
  <v-app>
    <v-app-bar color="#FFFFFF00" elevation="0">
      <v-row class="px-2">
        <v-col> Vease </v-col>
      </v-row>
    </v-app-bar>
    <v-navigation-drawer :width="50" color="#FFFFFF00">
      <v-tooltip text="Datas">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            flat
            icon
            height="50"
            width="50"
            color="#FFFFFF00"
          >
            <v-icon icon="mdi-folder" color="white"
          /></v-btn>
        </template>
      </v-tooltip>
    </v-navigation-drawer>
    <v-main class="page_background">
      <slot />
    </v-main>
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
