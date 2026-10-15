<script setup lang="ts">
import { useUpdaterStore } from "@vease/stores/updater";

const BYTES_IN_KILOBYTE = 1024;
const BYTES_IN_MEGABYTE = BYTES_IN_KILOBYTE * BYTES_IN_KILOBYTE;

const updaterStore = useUpdaterStore();
const dismissed = ref(false);

const state = computed(() => updaterStore.status.state);
const visible = computed(
  () =>
    !dismissed.value &&
    (state.value === "downloading" || state.value === "downloaded" || state.value === "error"),
);
const percent = computed(() => Math.round(updaterStore.status.percent ?? 0));

function toMegabytes(bytes: number | undefined): string {
  return ((bytes ?? 0) / BYTES_IN_MEGABYTE).toFixed(1);
}

watch(state, () => {
  dismissed.value = false;
});

onMounted(() => {
  void updaterStore.init();
});
</script>

<template>
  <v-snackbar
    :model-value="visible"
    :timeout="-1"
    location="bottom left"
    :color="state === 'error' ? 'error' : undefined"
    data-testid="updateSnackbar"
  >
    <template v-if="state === 'downloading'">
      <p class="mb-2">Downloading Vease v{{ updaterStore.status.version }}… {{ percent }}%</p>
      <v-progress-linear
        :model-value="percent"
        color="primary"
        height="6"
        rounded
        data-testid="updateProgress"
      />
      <p class="text-caption mt-1 mb-0">
        {{ toMegabytes(updaterStore.status.transferred) }} /
        {{ toMegabytes(updaterStore.status.total) }} MB ·
        {{ toMegabytes(updaterStore.status.bytesPerSecond) }} MB/s
      </p>
    </template>
    <template v-else-if="state === 'downloaded'">
      Vease v{{ updaterStore.status.version }} is ready to install
    </template>
    <template v-else-if="state === 'error'">
      Update failed: {{ updaterStore.status.message }}
    </template>

    <template #actions>
      <template v-if="state === 'downloaded'">
        <v-btn variant="text" data-testid="updateLaterButton" @click="dismissed = true">
          Later
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          data-testid="updateRestartButton"
          @click="updaterStore.restart()"
        >
          Restart now
        </v-btn>
      </template>
      <v-btn
        v-else-if="state === 'error'"
        icon="mdi-close"
        variant="text"
        data-testid="updateCloseButton"
        @click="dismissed = true"
      />
    </template>
  </v-snackbar>
</template>
