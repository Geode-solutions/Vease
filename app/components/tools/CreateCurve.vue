<script setup>
import PickButton from "@vease/components/tools/PickButton.vue";
import back_schemas from "@geode/opengeodeweb-back/opengeodeweb_back_schemas.json";
import { useCreateObjectTool } from "@vease/composables/create_object";

const {
  name: curveName,
  points,
  pickingActive,
  loading,
  hasValidPoints: hasValidCurve,
  validPointCount,
  addPoint,
  removePoint,
  togglePickMode,
  handleClose,
  sanitizeInput,
  handlePaste,
  createObject: createCurve,
} = useCreateObjectTool({
  namePrefix: "New Curve",
  minPoints: 2,
  schema: back_schemas.opengeodeweb_back.create.edged_curve,
  getAdditionalPayload: (validPts) => ({
    edges: validPts.slice(0, -1).map((_, i) => [i, i + 1]),
  }),
});
</script>

<template>
  <v-card flat color="transparent" class="pa-0 fill-height d-flex flex-column" theme="dark">
    <v-card-title class="pb-2 text-h5 font-weight-bold d-flex align-center text-white">
      <v-icon icon="mdi-vector-polyline" class="mr-3 text-h4" color="secondary" />
      Create Curve
    </v-card-title>

    <v-card-subtitle class="ma-0 pb-2 text-white opacity-80">
      Pick at least 2 points to create a curve.
    </v-card-subtitle>

    <v-card-text class="pt-2 flex-grow-1 overflow-y-auto">
      <v-text-field
        v-model="curveName"
        label="Curve Name"
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
              :disabled="points.length <= 2"
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
        :disabled="!hasValidCurve"
        class="text-none rounded-lg font-weight-bold"
        elevation="4"
        @click="createCurve"
      >
        <v-icon start>mdi-send</v-icon>
        Create Curve ({{ validPointCount }} pts)
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.point-row {
  transition: all 0.2s ease;
}
</style>
