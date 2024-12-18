<template>
  <v-row class="pa-2" align="center">
    <v-col cols="auto" justify="center">
      <v-icon size="30" icon="mdi-eye" v-tooltip:left="'Visibility'" />
    </v-col>
    <v-col cols="auto" justify="center">
      <v-switch v-model="visibility" inset hide-details />
    </v-col>
  </v-row>
</template>

<script setup>
const visibility = defineModel();
</script>
