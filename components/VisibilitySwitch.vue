<template>
  <v-switch v-model="visibility" inset
    ><template v-slot:label>
      <span class="input__label">Visibility</span>
    </template>
  </v-switch>
</template>

<script setup>
const visibility = defineModel();
</script>

<style scoped>
.input__label {
  font-weight: bold;
}
</style>
