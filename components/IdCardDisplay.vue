<template>
  <v-dialog v-model="idCardStore.isVisible" persistent max-width="300px">
    <v-card>
      <v-card-title class="text-h5">ID Sélectionné</v-card-title>
      <v-card-text class="text-center">
        {{ idCardStore.selectedId }}
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn color="primary" @click="idCardStore.hideCard()">Fermer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
const idCardStore = useIdCardStore();
console.log("ID Card Store State:", idCardStore);
</script>

<style scoped>
.text-center {
  text-align: center;
}
</style>
