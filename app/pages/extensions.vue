<script setup>
import { useExtensions } from "@vease/composables/extensions";

const { allowedExtensions } = useExtensions();
const extensions = await allowedExtensions();
</script>

<template>
  <div v-for="extension in extensions">
    <p>{{ extension.id }}</p>
    <p>{{ extension.version }}</p>
    <p>{{ extension.readme }}</p>
  </div>
</template>
