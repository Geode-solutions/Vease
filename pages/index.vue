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
import schemas from "@geode/opengeodeweb-viewer/schemas.json";
const viewer_store = use_viewer_store();

onMounted(async () => {
  console.log("MOUNTED", viewer_store);
  await viewer_store.ws_connect();
  console.log("connected");
  const id = "d4a253d71e9e4df096574b36639e317d";
  const file_name = "d4a253d71e9e4df096574b36639e317d.vtp";
  console.log("CALLING", { id, file_name });
  console.log(viewer_store.client);
  // await viewer_call({
  //   schema: schemas.opengeodeweb_viewer.create_object_pipeline,
  //   params: { id, file_name },
  // });
});
</script>

<style>
html {
  overflow-y: auto;
}
</style>
