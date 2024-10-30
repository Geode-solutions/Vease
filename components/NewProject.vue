<template>
  <v-dialog
    v-model="props.show_dialog"
    @click:outside="emit('close')"
    max-width="800px"
    radius="20px"
    class="text-center"
  >
    <v-sheet border="md">
      <v-card color="#3c9983">
        <v-card-title>
          <h3 class="mt-4">New Project</h3>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col>
                <v-text-field label="Project Name" required></v-text-field>
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
            >Create</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-sheet>
  </v-dialog>
</template>

<script setup>
const emit = defineEmits(["close"]);

const props = defineProps({
  show_dialog: { type: Boolean, required: true },
});
</script>
