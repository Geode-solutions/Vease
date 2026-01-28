<script setup>
  import logo from "@vease/assets/img/logo.png"
</script>

<template>
  <v-app-bar flat color="transparent" class="ma-1" height="60" :elevation="0">
    <v-row class="pa-1 ma-1 align-center">
      <v-img
        :src="logo"
        max-height="50"
        max-width="50"
        class="ml-3 mr-0"
        contain
        draggable="false"
      />
      <h2 style="color: white" class="ml-2 mb-1 title-text">Vease</h2>
    </v-row>
  </v-app-bar>
</template>
