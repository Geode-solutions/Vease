<template>
  <v-dialog v-model="dialog" max-width="800px">
    <v-card>
      <v-card-title>
        <h3 class="mt-4">Open Project</h3>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col>
              <v-file-input
                label="Select Project File"
                prepend-icon="mdi-folder-outline"
                @change="fileSelected"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions justify-center>
        <v-btn
          variant="outlined"
          color="white"
          text
          @click="dialog = false"
          class="ml-8 mb-4"
          >Close</v-btn
        >
        <v-btn
          variant="outlined"
          class="mb-4"
          color="white"
          text
          @click="openProject"
          >Open</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from "vue";

const dialog = ref(false);
const selectedFile = ref(null);

function openDialog() {
  dialog.value = true;
}

function fileSelected(file) {
  selectedFile.value = file;
}

function openProject() {
  // Code pour ouvrir le projet sélectionné
  dialog.value = false;
}

defineExpose({
  openDialog,
});
</script>
