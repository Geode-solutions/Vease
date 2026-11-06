<script setup lang="ts">
import { createHorizonStack } from "@vease/utils/controller/handlers/horizon_stack";
import { useHorizonStackForm } from "@vease/composables/horizon_stack_form";
import { useUIStore } from "@vease/stores/ui";

const emit = defineEmits<{ created: [] }>();

const UIStore = useUIStore();
const {
  name,
  horizons,
  units,
  duplicateHorizons,
  isValid,
  addHorizon,
  removeHorizon,
  moveHorizon,
  payload,
  reset,
} = useHorizonStackForm();
const loading = ref(false);

function horizonRules(value: string): (string | boolean)[] {
  return [
    value.trim() !== "" || "Horizon name is required",
    !duplicateHorizons.value.includes(value.trim()) || "Horizon names must be unique",
  ];
}

function handleClose(): void {
  reset();
  UIStore.setShowCreateTools(false);
}

async function create(): Promise<void> {
  if (!isValid.value) {
    return;
  }
  loading.value = true;
  try {
    await createHorizonStack(payload());
    reset();
    emit("created");
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <v-card flat color="transparent" class="pa-0 fill-height d-flex flex-column" theme="dark">
    <v-card-title class="pb-1 text-subtitle-1 font-weight-bold d-flex align-center text-white">
      <v-icon icon="mdi-layers-triple" class="mr-1 text-h5" color="secondary" />
      Create Horizon Stack
    </v-card-title>

    <v-card-subtitle
      class="ma-0 pb-1 text-caption text-white opacity-70 text-wrap"
      style="line-height: 1.2"
    >
      Name the horizons from top to bottom, and optionally the units between them.
    </v-card-subtitle>

    <v-card-text class="pt-5 flex-grow-1 overflow-y-auto">
      <v-text-field
        v-model="name"
        label="Horizon Stack Name"
        variant="outlined"
        color="white"
        density="compact"
        base-color="white"
        bg-color="rgba(255, 255, 255, 0.15)"
        class="mb-2 rounded-lg"
        prepend-inner-icon="mdi-format-title"
        data-testid="horizonStackName"
      />

      <div class="text-caption font-weight-bold text-white opacity-70 mb-1">
        Stratigraphic column (top to bottom)
      </div>
      <template v-for="(_, index) in horizons" :key="index">
        <v-text-field
          v-model="units[index]"
          variant="underlined"
          density="compact"
          hide-details
          :placeholder="`Unit ${index + 1}`"
          class="text-caption mx-2"
          :data-testid="`horizonStackUnit-${index}`"
        />
        <div class="d-flex align-center ga-1 my-1">
          <v-text-field
            v-model="horizons[index]"
            variant="outlined"
            density="compact"
            color="white"
            base-color="white"
            bg-color="rgba(var(--v-theme-primary), 0.15)"
            class="rounded-lg text-caption"
            :placeholder="`Horizon ${index + 1}`"
            :rules="horizonRules(horizons[index] ?? '')"
            prepend-inner-icon="mdi-minus"
            :data-testid="`horizonStackHorizon-${index}`"
          />
          <v-btn
            icon="mdi-arrow-up"
            size="x-small"
            variant="text"
            :disabled="index === 0"
            @click="moveHorizon(index, index - 1)"
          />
          <v-btn
            icon="mdi-arrow-down"
            size="x-small"
            variant="text"
            :disabled="index === horizons.length - 1"
            @click="moveHorizon(index, index + 1)"
          />
          <v-btn
            icon="mdi-close"
            size="x-small"
            variant="text"
            color="error"
            :disabled="horizons.length === 1"
            :data-testid="`removeHorizon-${index}`"
            @click="removeHorizon(index)"
          />
        </div>
      </template>
      <v-text-field
        v-model="units[horizons.length]"
        variant="underlined"
        density="compact"
        hide-details
        :placeholder="`Unit ${horizons.length + 1}`"
        class="text-caption mx-2"
        :data-testid="`horizonStackUnit-${horizons.length}`"
      />

      <v-btn
        variant="outlined"
        color="white"
        size="small"
        block
        class="text-none rounded-lg text-caption mt-3"
        prepend-icon="mdi-plus"
        data-testid="addHorizonButton"
        @click="addHorizon"
      >
        Add horizon
      </v-btn>
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
        :disabled="!isValid"
        class="text-none rounded-lg font-weight-bold"
        elevation="2"
        data-testid="submitButton"
        @click="create"
      >
        <v-icon start size="14">mdi-send</v-icon>
        Create Horizon Stack
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
