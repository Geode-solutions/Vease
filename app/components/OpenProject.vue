<script setup lang="ts">
interface Props {
  showDialog: boolean;
}

interface Emits {
  close: [];
}
const emit = defineEmits<Emits>();
const { showDialog } = defineProps<Props>();

const isVisible = computed({
  get: () => showDialog,
  set: (value) => {
    if (!value) {
      emit("close");
    }
  },
});
</script>

<template>
  <v-dialog
    v-model="isVisible"
    @click:outside="emit('close')"
    max-width="800px"
    class="text-center"
  >
    <v-sheet border="md">
      <v-card color="primary">
        <v-card-title>
          <h3 class="mt-4">Open Project</h3>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col>
                <v-file-input label="Open Project" required></v-file-input>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions justify-center>
          <v-btn variant="text" rounded="pill" text @click="emit('close')" class="ml-8 mb-4"
            >Close</v-btn
          >
          <v-btn
            variant="flat"
            class="mb-4"
            color="accent"
            rounded="pill"
            text
            @click="emit('close')"
            >Load</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-sheet>
  </v-dialog>
</template>
