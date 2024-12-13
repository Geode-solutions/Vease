<template>
  <v-switch v-model="visibility" inset
    ><template v-slot:label>
      <span class="font-weight-bold">Visibility</span>
    </template>
  </v-switch>
</template>

<script setup>
const visibility = defineModel();
</script>
