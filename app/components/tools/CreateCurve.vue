<script setup lang="ts">
import { AXIS_ICONS } from "@vease/utils/axis_icons";
import PickButton from "@vease/components/tools/PickButton.vue";
import back_schemas from "@geode/opengeodeweb-back/opengeodeweb_back_typed_schemas.js";
import { curveEdges } from "@vease/utils/create_geometry";
import { ref } from "vue";
import { useCreateObjectTool } from "@vease/composables/create_object";

const DISTANCE_TOLERANCE = 0.005;

const closed = ref(false);

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
  previewStyle: "curve",
  previewExtraSources: [closed],
  getPreviewParams: () => ({ closed: closed.value }),
  onPickedPoint: (newPoint, currentPoints) => {
    const [firstPoint] = currentPoints;
    if (firstPoint && firstPoint.x !== "") {
      const distance = Math.hypot(
        Number(newPoint.x) - Number(firstPoint.x),
        Number(newPoint.y) - Number(firstPoint.y),
        Number(newPoint.z) - Number(firstPoint.z),
      );
      if (distance < DISTANCE_TOLERANCE) {
        closed.value = true;
        return true;
      }
    }
    return false;
  },
  onReset: () => {
    closed.value = false;
  },
  getAdditionalPayload: (validPts) => ({ edges: curveEdges(validPts.length, closed.value) }),
});
</script>

<template>
  <v-card flat color="transparent" class="pa-0 fill-height d-flex flex-column">
    <v-card-title class="pb-1 text-subtitle-1 font-weight-bold d-flex align-center">
      <v-icon icon="ph-line-segments" class="mr-1 text-h5" color="secondary" />
      Create Curve
    </v-card-title>

    <v-card-subtitle class="ma-0 pb-1 text-caption text-wrap" style="line-height: 1.2">
      Pick at least 2 points to create a curve.
    </v-card-subtitle>

    <v-card-text class="pt-5 flex-grow-1 overflow-y-auto">
      <v-text-field
        v-model="curveName"
        label="Curve Name"
        variant="outlined"
        color="primary"
        density="compact"
        bg-color="surface-light"
        class="mb-2 rounded-lg"
        prepend-inner-icon="ph-text-t"
      />
      <v-form class="mt-1">
        <div
          v-for="(point, index) in points"
          :key="index"
          class="point-row"
          :class="{ 'mb-2': index < points.length - 1 }"
        >
          <div class="d-flex align-center mb-1">
            <v-icon size="small" color="secondary" class="mr-1">ph-dot-outline</v-icon>
            <span class="text-caption text-medium-emphasis font-weight-bold text-uppercase">
              Point {{ index + 1 }}
            </span>
            <v-spacer />
            <v-btn
              icon
              size="x-small"
              variant="text"
              :disabled="points.length <= 2"
              @click="removePoint(index)"
            >
              <v-icon size="14">ph-x</v-icon>
            </v-btn>
          </div>

          <v-row density="compact" :data-testid="'point-' + index">
            <v-col v-for="coord in ['x', 'y', 'z']" :key="coord" cols="4">
              <v-text-field
                v-model="point[coord]"
                inputmode="decimal"
                variant="outlined"
                color="primary"
                density="compact"
                :rules="[
                  (value) =>
                    (value !== '' && value != null) || `${coord.toUpperCase()} is required`,
                ]"
                class="rounded-lg text-caption"
                bg-color="surface-light"
                @paste="handlePaste($event, index, coord)"
                @update:modelValue="(value) => sanitizeInput(value, index, coord)"
              >
                <template #label>
                  <span class="text-caption">{{ coord.toUpperCase() }}</span>
                </template>
                <template #prepend-inner>
                  <v-icon size="14" :icon="AXIS_ICONS[coord]" />
                </template>
              </v-text-field>
            </v-col>
          </v-row>
          <v-divider v-if="index < points.length - 1" class="mt-1 opacity-20" />
        </div>
        <v-row density="compact" class="mt-2">
          <v-col cols="6">
            <v-btn
              variant="tonal"
              color="primary"
              size="small"
              block
              class="text-none rounded-pill text-caption"
              prepend-icon="ph-plus"
              data-testid="addPointButton"
              @click="addPoint"
            >
              Add point
            </v-btn>
          </v-col>
          <v-col cols="6">
            <PickButton :active="pickingActive" @click="togglePickMode" />
          </v-col>
        </v-row>
        <v-row density="compact" class="mt-2">
          <v-col cols="12">
            <v-checkbox
              v-model="closed"
              label="Closed curve"
              color="secondary"
              density="compact"
              hide-details
              data-testid="closedCurveCheckbox"
            />
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>

    <v-card-actions class="px-0 pb-0 mt-2">
      <v-btn
        variant="text"
        color="primary"
        size="small"
        class="text-none rounded-pill"
        @click="handleClose"
      >
        <v-icon start size="14">ph-x-circle</v-icon>Close
      </v-btn>
      <v-spacer />
      <v-btn
        color="accent"
        size="small"
        variant="flat"
        :loading="loading"
        :disabled="!hasValidCurve"
        class="text-none rounded-pill font-weight-bold"
        data-testid="submitButton"
        @click="createCurve"
      >
        <v-icon start size="14">ph-paper-plane-right</v-icon>
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
