<template>
  <v-dialog
    v-model="props.show_dialog"
    @click:outside="emit('close')"
    max-width="800px"
    class="text-center"
  >
    <v-sheet border="md">
      <v-card color="#3c9983">
        <v-card-title>
          <h3 class="mt-4">Take a screenshot</h3>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="8">
                <v-text-field
                  v-model="filename"
                  label="File name"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model="output_extension"
                  :items="['png', 'jpg']"
                  label="Extension"
                  required
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-switch
                  v-model="include_background"
                  label="Include background"
                  inset
                ></v-switch>
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
            >Cancel</v-btn
          >
          <v-btn
            variant="outlined"
            class="mb-4"
            color="white"
            text
            @click="takeScreenshot()"
            >Load</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-sheet>
  </v-dialog>
</template>

<script setup>
const emit = defineEmits(["close"]);
import viewer_schemas from "@geode/opengeodeweb-viewer/schemas.json";

const props = defineProps({
  show_dialog: { type: Boolean, required: true },
});

const filename = ref("");
const output_extension = ref("png");
const include_background = ref(true);

async function takeScreenshot() {
  console.log("screenshot");

  await viewer_call({
    schema: viewer_schemas.opengeodeweb_viewer.take_screenshot,
    params: {
      filename: filename.value,
      output_extension: output_extension.value,
      include_background: include_background.value,
    },
  });

  emit("close");
}
</script>
