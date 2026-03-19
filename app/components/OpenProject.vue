<script setup>
  const emit = defineEmits(["close"])
  const { show_dialog } = defineProps({
    show_dialog: { type: Boolean, required: true },
  })

  const isVisible = computed({
    get: () => show_dialog,
    set: (value) => {
      if (!value) {
        emit("close")
      }
    },
  })
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
          <v-btn
            variant="outlined"
            color="white"
            text
            @click="emit('close')"
            class="ml-8 mb-4"
            >Close</v-btn
          >
          <v-btn
            variant="outlined"
            class="mb-4"
            color="white"
            text
            @click="emit('close')"
            >Load</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-sheet>
  </v-dialog>
</template>
