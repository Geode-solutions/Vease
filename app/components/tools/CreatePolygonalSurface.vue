<script setup>
import PickButton from "@vease/components/tools/PickButton.vue";
import back_schemas from "@geode/opengeodeweb-back/opengeodeweb_back_schemas.json";
import { useCreateObjectTool } from "@vease/composables/create_object";

const {
  name: surfaceName,
  points,
  pickingActive,
  loading,
  hasValidPoints: hasValidSurface,
  validPointCount,
  addPoint,
  removePoint,
  togglePickMode,
  handleClose,
  sanitizeInput,
  handlePaste,
  createObject: createSurface,
} = useCreateObjectTool({
  namePrefix: "New Surface",
  minPoints: 3,
  schema: back_schemas.opengeodeweb_back.create.polygonal_surface,
  previewStyle: "surface",
  getAdditionalPayload: (validPts) => ({
    polygons: [Array.from({ length: validPts.length }, (_, i) => i)],
  }),
});
</script>

<template>
  <v-card flat color="transparent" class="pa-0 fill-height d-flex flex-column" theme="dark">
    <v-card-title class="pb-1 text-subtitle-1 font-weight-bold d-flex align-center text-white">
      <v-icon icon="mdi-vector-polygon" class="mr-1 text-h5" color="secondary" />
      Create Surface
    </v-card-title>

    <v-card-subtitle
      class="ma-0 pb-1 text-caption text-white opacity-70 text-wrap"
      style="line-height: 1.2"
    >
      Pick at least 3 points to create a surface.
    </v-card-subtitle>

    <v-card-text class="pt-5 flex-grow-1 overflow-y-auto">
      <v-text-field
        v-model="surfaceName"
        label="Surface Name"
        variant="outlined"
        color="white"
        theme="dark"
        density="compact"
        base-color="white"
        bg-color="rgba(255, 255, 255, 0.15)"
        class="mb-2 rounded-lg"
        prepend-inner-icon="mdi-format-title"
      />
      <v-form class="mt-1">
        <div
          v-for="(point, index) in points"
          :key="index"
          class="point-row"
          :class="{ 'mb-2': index < points.length - 1 }"
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
              :disabled="points.length <= 3"
              @click="removePoint(index)"
            >
              <v-icon size="14">mdi-close</v-icon>
            </v-btn>
          </div>

          <v-row dense>
            <v-col v-for="coord in ['x', 'y', 'z']" :key="coord" cols="4">
              <v-text-field
                v-model="point[coord]"
                inputmode="decimal"
                variant="outlined"
                color="white"
                density="compact"
                :rules="[(v) => !!v || `${coord.toUpperCase()} is required`]"
                class="rounded-lg text-caption"
                theme="dark"
                base-color="white"
                bg-color="rgba(255, 255, 255, 0.15)"
                @paste="handlePaste($event, index, coord)"
                @update:modelValue="(v) => sanitizeInput(v, index, coord)"
              >
                <template #label>
                  <span class="text-white text-caption">{{ coord.toUpperCase() }}</span>
                </template>
                <template #prepend-inner>
                  <v-icon color="white" size="14">mdi-axis-{{ coord }}-arrow</v-icon>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
          <v-divider v-if="index < points.length - 1" class="mt-1 opacity-20" />
        </div>
        <v-row dense class="mt-2">
          <v-col cols="6">
            <v-btn
              variant="outlined"
              color="white"
              size="small"
              block
              class="text-none rounded-lg text-caption"
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
        size="small"
        class="text-none rounded-lg"
        @click="handleClose"
      >
        <v-icon start size="14">mdi-close-circle</v-icon>Close
      </v-btn>
      <v-spacer />
      <v-btn
        color="primary"
        size="small"
        variant="flat"
        :loading="loading"
        :disabled="!hasValidSurface"
        class="text-none rounded-lg font-weight-bold"
        elevation="2"
        @click="createSurface"
      >
        <v-icon start size="14">mdi-send</v-icon>
        Create ({{ validPointCount }} points)
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.point-row {
  transition: all 0.2s ease;
}
</style>
