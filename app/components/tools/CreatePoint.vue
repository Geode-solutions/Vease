<script setup>
import PickButton from "@vease/components/tools/PickButton.vue";
import back_schemas from "@geode/opengeodeweb-back/opengeodeweb_back_schemas.json";
import { useCreateObjectTool } from "@vease/composables/create_object";

const {
  name: setName,
  points,
  pickingActive,
  loading,
  hasValidPoints: hasValidPoint,
  validPointCount,
  addPoint,
  removePoint,
  togglePickMode,
  handleClose,
  sanitizeInput,
  handlePaste,
  createObject: createAllPoints,
} = useCreateObjectTool({
  namePrefix: "New PointSet",
  minPoints: 1,
  schema: back_schemas.opengeodeweb_back.create.point_set,
});
</script>

<template>
  <v-card flat color="transparent" class="pa-0 fill-height d-flex flex-column" theme="dark">
    <v-card-title class="pb-2 text-h5 font-weight-bold d-flex align-center text-white">
      <v-icon icon="mdi-circle-medium" class="mr-3 text-h4" color="secondary" />
      Create Point{{ points.length > 1 ? "s" : "" }}
    </v-card-title>

    <v-card-subtitle class="ma-0 pb-2 text-white opacity-80">
      Enter coordinates, use + to add rows, or enable pick mode.
    </v-card-subtitle>

    <v-card-text class="pt-2 flex-grow-1 overflow-y-auto">
      <v-text-field
        v-model="setName"
        label="Point Set Name"
        variant="outlined"
        color="white"
        theme="dark"
        base-color="white"
        bg-color="rgba(255, 255, 255, 0.15)"
        class="mb-4 rounded-lg"
        prepend-inner-icon="mdi-format-title"
      />
      <v-form class="mt-2">
        <div
          v-for="(point, index) in points"
          :key="index"
          class="point-row"
          :class="{ 'mb-4': index < points.length - 1 }"
        >
          <div class="d-flex align-center mb-1">
            <v-icon size="small" color="secondary" class="mr-1">mdi-circle-small</v-icon>
            <span class="text-caption text-white opacity-60 font-weight-bold text-uppercase">
              Point {{ index + 1 }}
            </span>
            <v-spacer />
            <v-btn
              icon
              size="x-small"
              variant="text"
              color="white"
              :disabled="points.length === 1"
              @click="removePoint(index)"
            >
              <v-icon size="16">mdi-close</v-icon>
            </v-btn>
          </div>

          <v-row dense>
            <v-col v-for="coord in ['x', 'y', 'z']" :key="coord" cols="4">
              <v-text-field
                v-model="point[coord]"
                inputmode="decimal"
                variant="outlined"
                color="white"
                density="comfortable"
                :rules="[(v) => !!v || `${coord.toUpperCase()} is required`]"
                class="rounded-lg"
                theme="dark"
                base-color="white"
                bg-color="rgba(255, 255, 255, 0.15)"
                @paste="handlePaste($event, index, coord)"
                @update:modelValue="(v) => sanitizeInput(v, index, coord)"
              >
                <template #label
                  ><span class="text-white">{{ coord.toUpperCase() }}</span></template
                >
                <template #prepend-inner
                  ><v-icon color="white">mdi-axis-{{ coord }}-arrow</v-icon></template
                >
              </v-text-field>
            </v-col>
          </v-row>
          <v-divider v-if="index < points.length - 1" class="mt-2 opacity-20" />
        </div>
        <v-row dense class="mt-3">
          <v-col cols="6">
            <v-btn
              variant="outlined"
              color="white"
              size="small"
              block
              class="text-none rounded-lg"
              prepend-icon="mdi-plus"
              @click="addPoint"
            >
              Add point
            </v-btn>
          </v-col>
          <v-col cols="6">
            <PickButton :active="pickingActive" @click="togglePickMode" />
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>

    <v-card-actions class="px-0 pb-0 mt-2">
      <v-btn
        variant="text"
        color="white"
        size="large"
        class="text-none rounded-lg"
        @click="handleClose"
      >
        <v-icon start>mdi-close-circle</v-icon>Close
      </v-btn>
      <v-spacer />
      <v-btn
        color="primary"
        size="large"
        variant="flat"
        :loading="loading"
        :disabled="!hasValidPoint"
        class="text-none rounded-lg font-weight-bold"
        elevation="4"
        @click="createAllPoints"
      >
        <v-icon start>mdi-send</v-icon>
        Create {{ validPointCount > 1 ? `${validPointCount} Points` : "Point" }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.point-row {
  transition: all 0.2s ease;
}
</style>
