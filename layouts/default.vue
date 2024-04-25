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
      <App />
    </v-main>
  </v-app>
</template>
