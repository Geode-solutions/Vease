<template>
  <v-row class="fill-height pa-5">
    <v-col cols="12">
      <v-card style="height: 100%; width: 100%">
        <RemoteRenderingView />
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
const geode_store = use_geode_store();

onMounted(async () => {
  const result = await window.electronAPI.run_back(
    useRuntimeConfig().public.GEODE_PORT
  );
  console.log("FROM INDEX", result);
  await geode_store.ping_task();
});
</script>

<style>
html {
  overflow-y: auto;
}
</style>
