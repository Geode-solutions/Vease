<template>
  <v-overlay
    v-model="UIStore.showDropZone"
    @keyup.esc="UIStore.setShowDropZone(false)"
    @click:outside="UIStore.setShowDropZone(false)"
    height="100%"
    width="100%"
    @dragover.prevent
    @dragleave.prevent
  >
    <v-row no-gutters class="fill-height">
      <v-col
        cols="12"
        class="fill-height justify-center rounded-lg align-center d-flex"
      >
        <v-card
          align="center"
          justify="center"
          height="100%"
          width="100%"
          color="transparent"
          class="pa-5 justify-center align-center d-flex"
          elevation="0"
          @drop="onDrop"
        >
          <v-card
            width="95%"
            height="95%"
            class="pa-10 justify-center rounded-lg align-center d-flex"
            color="primary"
            style="border: 10px dashed white"
            rounded
          >
            <p class="text-h4 text-white">
              Drop your files here
              <v-icon color="white" size="35">mdi-file-upload-outline</v-icon>
            </p>
          </v-card>
        </v-card>
      </v-col>
    </v-row>
  </v-overlay>
</template>

<script setup>
const UIStore = useUIStore();
const feedback_store = use_feedback_store();

const onDrop = (e) => {
  e.preventDefault();

  const files = e.dataTransfer.files;
  if (files.length === 0) {
    feedback_store.add_error(
      500,
      "/internal",
      "Internal error",
      "No file dropped."
    );
  } else {
    for (const file of files) {
      feedback_store.add_success(`File(s) dropped : ${file.name} ${file.type}`);
    }
    UIStore.setDroppedFiles(Array.from(files));
    UIStore.setShowStepper(true);
  }

  UIStore.setShowDropZone(false);
};
</script>

<style scoped>
.drop-zone {
  background-color: transparent;
  border-width: 0;
  border: solid 0px transparent;
  height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
