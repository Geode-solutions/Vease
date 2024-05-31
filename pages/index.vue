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
// const viewer_store = use_viewer_store();
// await viewer_store.ws_connect();

onMounted(async () => {
  const result = await window.electronAPI.run_back(
    useRuntimeConfig().public.GEODE_PORT
  );
  console.log("FROM INDEX", result);
});
</script>

<style>
html {
  overflow-y: auto;
}
</style>
