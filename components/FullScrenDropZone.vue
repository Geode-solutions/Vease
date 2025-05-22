<template>
  <v-overlay
    v-model="UIStore.showDropZone"
    @keyup.esc="UIStore.disableDropZone()"
    @click:outside="UIStore.disableDropZone()"
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
    feedback_store.add_success(`${files.length} file(s) dropped`);
    UIStore.setDroppedFiles(Array.from(files));
    UIStore.setShowStepper(true);
  }

  UIStore.setShowDropZone(false);
};
</script>
