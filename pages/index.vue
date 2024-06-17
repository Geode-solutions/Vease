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
const infra_store = use_infra_store();
const geode_store = use_geode_store();
const viewer_store = use_viewer_store();

onMounted(async () => {
  await infra_store.create_connexion();
  geode_store.ping_task();
  viewer_store.ws_connect();
});
</script>

<style>
html {
  overflow-y: auto;
}
</style>
